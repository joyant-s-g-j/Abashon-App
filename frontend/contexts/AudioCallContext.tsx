import { AudioCallService, CallState } from "@/services/audioCallService";
import { createContext, ReactNode, use, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AudioCallContextType {
    callState: CallState;
    audioCallService: AudioCallService | null;
    initiateCall: (receiverId: string, receiverName: string, receiverAvatar?: string) => Promise<void>;
    acceptCall: (callId: string) => Promise<void>;
    rejectCall: (callId: string) => void;
    endCall: () => void;
    toggleMute: () => boolean;
    isMuted: boolean;
    callDuration: number;
}

const AudioCallContext = createContext<AudioCallContextType | undefined>(undefined)

interface AudioCallProviderProps {
    children: ReactNode
}

export const AudioCallProvider: React.FC<AudioCallProviderProps> = ({ children }) => {
    const { socket } = useSocket();
    const [audioCallService, setAudioCallService] = useState<AudioCallService | null>(null);
    const [isMuted, setIsMuted] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null)
    
    const [callState, setCallSate] = useState<CallState>({
        isCallActive: false,
        isIncoming: false,
        isOutgoing: false,
        callId: null,
        callerInfo: null
    })

    useEffect(() => {
        if(socket) {
            const service = new AudioCallService(socket)
            setAudioCallService(service)

            socket.on('incoming-call', ({ callId, callerId, callerName, callerAvatar, type}: {
                callId: string;
                callerId: string;
                callerName: string;
                callerAvatar?: string;
                type: string;
            }) => {
                console.log('Incoming call received:', { callId, callerName });
                setCallSate({
                    isCallActive: false,
                    isIncoming: true,
                    isOutgoing: false,
                    callId,
                    callerInfo: {
                        id: callerId,
                        name: callerName,
                        avatar: callerAvatar
                    }
                })
            })

            socket.on('call-accepted', ({ callId}: { callId: string }) => {
                console.log('Call accepted:', callId);
                setCallSate(prev => ({
                    ...prev,
                    isCallActive: true,
                    isOutgoing: false
                }));
                startCallTimer()
            });

            socket.on('call-rejected', ({ callId }: { callId: string }) => {
                console.log('Call rejected:', callId);
                Alert.alert('Call Rejected', 'The user declined your call.')
                resetCallState()
            });

            socket.on('call-ended', ({ callId, reason }: { callId: string; reason?: string}) => {
                console.log('Call ended:', callId, reason);
                if(reason === 'user_disconnected') {
                    Alert.alert('Call Ended', 'The other user disconnected')
                }
                resetCallState()
            });

            socket.on('user-offline', ({ receiverId }: { receiverId: string }) => {
                console.log('User offline:', receiverId);
                Alert.alert('User Offline', 'The user is currently offline.');
                resetCallState();
            })

            return () => {
                socket.off('incoming-call');
                socket.off('call-accepted');
                socket.off('call-rejected');
                socket.off('call-ended');
                socket.off('user-offline');
            }
        }
    }, [socket])

    const startCallTimer = () => {
        setCallDuration(0);
        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1)
        }, 1000);
        setCallTimer(timer as any)
    }

    const stopCallTimer = () => {
        if(callTimer) {
            clearInterval(callTimer)
            setCallTimer(null)
        }
        setCallDuration(0)
    }

    const resetCallState = () => {
        setCallSate({
            isCallActive: false,
            isIncoming: false,
            isOutgoing: false,
            callId: null,
            callerInfo: null
        })
        setIsMuted(false)
        stopCallTimer()
    }

    const initiateCall = async (receiverId: string, receiverName: string, receiverAvatar?: string): Promise<void> => {
        if(!audioCallService) {
            Alert.alert('Error', 'Audio call service not available')
            return;
        }

        try {
            const userData = await AsyncStorage.getItem('user')
            if(userData) {
                const user = JSON.parse(userData);
                console.log('Initiating call to:', receiverName);

                setCallSate({
                    isCallActive: false,
                    isIncoming: false,
                    isOutgoing: true,
                    callId: null,
                    callerInfo: {
                        id: receiverId,
                        name: receiverName,
                        avatar: receiverAvatar
                    }
                });

                await audioCallService.initiateCall(receiverId, user.name, user.avatar)
            }
        } catch (error) {
            console.error('Error initiating call:', error);
            Alert.alert('Error', 'Failed to initiate call. Please check your microphone permissions.');
            resetCallState();
        }
    }

    const acceptCall = async (callId: string): Promise<void> => {
        if(!audioCallService) {
            Alert.alert('Error', 'Audio call service not available')
            return;
        }

        try {
            console.log('Accepting call:', callId);
            await audioCallService.acceptCall(callId)

            setCallSate(prev => ({
                ...prev,
                isCallActive: true,
                isIncoming: false
            }))

            startCallTimer()
        } catch (error) {
            console.error('Error accepting call:', error);
            Alert.alert('Error', 'Failed to accept call. Please check your microphone permissions.');
            resetCallState();
        }
    }

    const rejectCall = (callId: string): void => {
        if(!audioCallService) return;
        console.log('Rejecting call:', callId);
        audioCallService.rejectCall(callId)
        resetCallState()
    }

    const endCall = (): void => {
        if(!audioCallService) return;
        console.log('Ending call');
        audioCallService.endCall()
        resetCallState()
    }

    const toggleMute = (): boolean => {
        if(!audioCallService) return false;
        const muted = audioCallService.toggleMute()
        setIsMuted(muted)
        return muted
    }
    return (
        <AudioCallContext.Provider value={{
            callState,
            audioCallService,
            initiateCall,
            acceptCall,
            rejectCall,
            endCall,
            toggleMute,
            isMuted,
            callDuration
        }}>
            {children}
        </AudioCallContext.Provider>
    )
}

export const useAudioCall = (): AudioCallContextType => {
    const context = useContext(AudioCallContext)
    if(!context) {
        throw new Error('useAudioCall must be used within an AudioCallProvider');
    }
    return context
}