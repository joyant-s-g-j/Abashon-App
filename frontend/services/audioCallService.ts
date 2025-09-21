import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices } from "react-native-webrtc"

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
    private localSteam: any = null;
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
            // await this.createOffer()
        })
    }

    async initiateCall(receiverId: string, callerName: string, callerAvatar?: string): Promise<void> {
        try {
            console.log('Initiating call to:', receiverId);
            await this.setupLocalStream()
        } catch (error) {
            
        }
    }

    private async setupLocalStream(): Promise<void> {
        try {
            const stream = await mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
            this.localSteam = stream;
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
        if(this.localSteam) {
            this.localSteam.getTracks().forEach((track: any) => {
                this.peerConnection?.addTrack(track, this.localSteam)
            })
        }

        // Handle remote stream
        
    }
}