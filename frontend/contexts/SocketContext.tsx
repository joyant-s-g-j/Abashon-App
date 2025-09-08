import { User } from "@/components/PropertyManagement/types/property";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client"

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
    isConnected: boolean;
}

interface SocketProviderProps {
    children: ReactNode;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext)
    if(!context) {
        throw new Error("useSocket must be used within SocketProvider");
    }
    return context
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        let socketInstance: Socket | null = null;

        const initailizeSocket = async () => {
            try {
                const userData = await AsyncStorage.getItem("user")

                if(userData) {
                    const user: User = JSON.parse(userData)

                    const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL

                    if(!apiUrl) {
                        return
                    }
                    socketInstance = io(apiUrl, {
                        query: { userId: user._id },
                        transports: ["websocket"],
                        forceNew: true,
                        timeout: 10000
                    })

                    socketInstance.on("connect", () => {
                        setIsConnected(true)
                    })

                    socketInstance.on("disconnect", () => {
                        setIsConnected(false)
                    })

                    socketInstance.on("getOnlineUsers", (users: string[]) => {
                        setOnlineUsers(users)
                    })

                    socketInstance.on("connect_error", (error: Error) => {
                        setIsConnected(false)
                    })

                    setSocket(socketInstance)
                }
            } catch (error) {
                console.error("Socket initialization error:", error);
            }
        };

        initailizeSocket();

        return () => {
            if(socketInstance) {
                socketInstance.disconnect()
                setSocket(null)
                setIsConnected(false)
                setOnlineUsers([])
            }
        }
    }, [])

    return (
        <SocketContext.Provider
            value={{
                socket,
                onlineUsers,
                isConnected
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}