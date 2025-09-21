declare module 'react-native-webrtc' {
    export interface RTCPeerConnection {
        addEventListener(type: 'addstream', listener: (event: any) => void): void;
        addEventListener(type: 'icecandidate', listener: (event: any) => void): void;
        addEventListener(type: 'connectionstatechange', listener: () => void): void;
        removeEventListener(type: string, listener: (...args: any[]) => void): void;

        addTrack(track: any, stream: any): void;
        createOffer(): Promise<RTCSessionDescriptionInit>;
        createAnswer(): Promise<RTCSessionDescriptionInit>;
        setLocalDescription(description: RTCSessionDescriptionInit): Promise<void>;
        setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
        addIceCandidate(candidate: RTCIceCandidate): Promise<void>;
        close(): void;

        connectionState: 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed'
    }

    export interface RTCSessionDescriptionInit {
        type: 'offer' | 'answer';
        sdp: string;
    }

    export interface RTCIceCandidate {
        candidate: string;
        sdpMLineIndex: number | null;
        sdpMid: string | null;
    }

    export interface MediaDevices {
        getUserMedia(constraints: {
            audio?: boolean;
            video?: boolean;
        }): Promise<any>
    }

    export const RTCPeerConnection: {
        new (configuration?: any): RTCPeerConnection;
    };

    export const RTCIceCandidate: {
        new (init: any): RTCIceCandidate;
    };

    export const RTCSessionDescription: {
        new (init: RTCSessionDescriptionInit): RTCSessionDescriptionInit;
    };

    export const mediaDevices: MediaDevices
}