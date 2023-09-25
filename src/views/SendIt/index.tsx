import {useParams} from "react-router-dom";
import {useEffect, useCallback} from "react";
import {io, Socket} from "socket.io-client"
import {socketEvents} from "../../socket.events.ts";

export const SendIt = () => {
    const {roomId} = useParams()

    const handleSocketConnection = useCallback((socketHandler: Socket) => {
        socketHandler.emit(socketEvents.JOIN_ROOM, roomId)
        setTimeout(() => {
            socketHandler.emit(socketEvents.CLIENT.CONNECT, roomId)
        }, 500)
    }, [])

        useEffect(() => {
            const socketHandler = io('http://localhost:3080')
            handleSocketConnection(socketHandler)
            window.addEventListener('beforeunload', () => {
                socketHandler.emit('leave-room', roomId)
            })
            return () => {
                window.removeEventListener('beforeunload', () => {})
            }
        },[])


    return <div>Send It</div>
}
