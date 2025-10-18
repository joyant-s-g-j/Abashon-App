import AsyncStorage from "@react-native-async-storage/async-storage";
let RTCPeerConnection: any, RTCIceCandidate: any, RTCSessionDescription: any, mediaDevices: any;

try {
  const webrtc = require("react-native-webrtc");
  RTCPeerConnection = webrtc.RTCPeerConnection;
  RTCIceCandidate = webrtc.RTCIceCandidate;
  RTCSessionDescription = webrtc.RTCSessionDescription;
  mediaDevices = webrtc.mediaDevices;
} catch (error) {
  console.warn("WebRTC not available - audio calls disabled");
}

export interface CallState {
    isCallActive: boolean;
    isIncoming: boolean;
    isOutgoing: boolean;
    callId: string | null;
    callerInfo: {
        id: string;
        name: string;
        avatar?: string;
    } | null;
}

export class AudioCallService {
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: any = null;
    private remoteStream: any = null;
    private socket: any = null;
    private callId: string | null = null;

    constructor(socket: any) {
        this.socket = socket;
        this.setupSocketListeners()
    }

    private setupSocketListeners() {
        if(!this.socket) return;

        this.socket.on('call-initiated', ({ callId }: { callId: string}) => {
            this.callId = callId;
            console.log('Call initiated with ID:', callId);
        })

        this.socket.on('call-accepted', async({ callId }: { callId: string}) => {
            this.callId = callId;
            console.log('Call accepted:', callId);
            await this.createOffer()
        })

        this.socket.on('offer', async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
            console.log('Received offer');
            await this.handleOffer(offer)
        })

        this.socket.on('answer', async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            console.log('Received answer');
            await this.handleAnswer(answer)
        })

        this.socket.on('ice-candidate', async ({ candidate }: { candidate: any}) => {
            console.log('Received ICE candidate');
            await this.handleIceCandidate(candidate)
        })
    }

    async initiateCall(receiverId: string, callerName: string, callerAvatar?: string): Promise<void> {
        try {
            console.log('Initiating call to:', receiverId);
            await this.setupLocalStream()
            await this.createPeerConnection()

            const currentUserId = await this.getCurrentUserId()

            this.socket?.emit('initiate-call', {
                callerId: currentUserId,
                receiverId,
                callerName,
                callerAvatar
            })
        } catch (error) {
            console.error('Error initiating call:', error);
            throw error;
        }
    }

    async acceptCall(callId: string): Promise<void> {
        try {
            console.log('Accepting call:', callId);
            this.callId = callId;
            await this.setupLocalStream()
            await this.createPeerConnection()

            this.socket?.emit('accept-call', { callId })
        } catch (error) {
            console.error('Error accepting call:', error);
            throw error;
        }
    }

    rejectCall(callId: string): void {
        console.log('Rejecting call:', callId);
        this.socket?.emit('reject-call', { callId });
        this.cleanup()
    }

    endCall(): void {
        console.log('Ending call:', this.callId);
        if(this.callId) {
            this.socket?.emit('end-call', { callId: this.callId })
        }
        this.cleanup()
    }

    private async setupLocalStream(): Promise<void> {
        try {
            console.log('Setting up local stream');
            const stream = await mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
            this.localStream = stream;
            console.log('Local stream setup successful');
        } catch (error) {
            console.error('Error getting user media:', error);
            throw new Error('Failed to access microphone. Please check permissions.');
        }
    }

    private async createPeerConnection(): Promise<void> {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
        console.log('Creating peer connection');
        this.peerConnection = new RTCPeerConnection(configuration)

        // Add local stream to peer connection
        if(this.localStream) {
            this.localStream.getTracks().forEach((track: any) => {
                this.peerConnection?.addTrack(track, this.localStream)
            })
        }

        // Handle remote stream
        this.peerConnection?.addEventListener('addstream', (event: any) => {
            console.log('Received remote stream');
            this.remoteStream = event.stream;
        })

        // Handle ICE candidates
        this.peerConnection?.addEventListener('icecandidate', (event: any) => {
            if(event.candidate && this.callId) {
                console.log('Sending ICE candidate');
                this.socket?.emit('ice-candidate', {
                    callId: this.callId,
                    candidate: event.candidate
                })
            }
        })

        // Handle connection state changes
        this.peerConnection?.addEventListener('connectionstatechange', () => {
            console.log('Connection state:', this.peerConnection?.connectionState);
            if(this.peerConnection?.connectionState === 'connected') {
                this.socket?.emit('call-connected', { callId: this.callId })
            }
        })
    }

    private async createOffer(): Promise<void> {
        if(!this.peerConnection || !this.callId) return;

        try {
            console.log('Creating offer');
            const offer = await this.peerConnection.createOffer()
            await this.peerConnection.setLocalDescription(offer)

            this.socket?.emit('offer', {
                callId: this.callId,
                offer
            })
        } catch (error) {
            console.error('Error creating offer:', error)
        }
    }

    private async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
        if(!this.peerConnection || !this.callId) return;

        try {
            console.log('Handling offer');
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer as any))
            const answer = await this.peerConnection.createAnswer()
            await this.peerConnection.setLocalDescription(answer)

            this.socket?.emit('answer', {
                callId: this.callId,
                answer
            })
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    }

    private async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
        if(!this.peerConnection) return;

        try {
            console.log('Handling answer');
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer as any))
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    }

    private async handleIceCandidate(candidate: any): Promise<void> {
        if(!this.peerConnection) return;

        try {
            console.log('Handling ICE candidate');
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (error) {
            console.log('Error adding ICE candidate', error);
        }
    }

    private async getCurrentUserId(): Promise<string> {
        try {
            const userData = await AsyncStorage.getItem('user')
            if(userData) {
                const user = JSON.parse(userData)
                return user._id
            }
            throw new Error('User not found')
        } catch (error) {
            console.error('Error getting current user ID:', error);
            throw error;
        }
    }

    private cleanup(): void {
        console.log('Cleaning up call resources');
        
        if(this.localStream) {
            this.localStream.getTracks().forEach((track: any) => track.stop());
            this.localStream = null;
        }

        if(this.peerConnection) {
            this.peerConnection.removeEventListener('addstream', () => {});
            this.peerConnection.removeEventListener('icecandidate', () => {});
            this.peerConnection.removeEventListener('connectionstatechange', () => {});

            this.peerConnection.close();
            this.peerConnection = null
        }

        this.remoteStream = null;
        this.callId = null
    }

    toggleMute(): boolean {
        if(this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0]
            if(audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                return !audioTrack.enabled;
            }
        }
        return false
    }

    getLocalStream() {
        return this.localStream
    }

    getRemoteStream() {
        return this.remoteStream;
    }

    getConnectionState(): string {
        return this.peerConnection?.connectionState || 'new'
    }
}