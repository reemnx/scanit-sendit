import {useParams} from "react-router-dom";
import {useEffect, useCallback, useState, useRef} from "react";
import {io, Socket} from "socket.io-client"
import {socketEvents} from "../../socket.events.ts";

export const SendIt = () => {
    const {roomId} = useParams()
    const [fileUrls, setFileUrls] = useState<string[]>([])

    const socketHandler = useRef<Socket>(io('http://localhost:3080'))

    const handleSocketConnection = useCallback(() => {
        socketHandler.current.emit(socketEvents.JOIN_ROOM, roomId)
        setTimeout(() => {
            socketHandler.current.emit(socketEvents.CLIENT.CONNECT, roomId)
        }, 500)
    }, [])

    const handleFiles = (e: Event) => {
        const data = e.target as HTMLInputElement
        const files = data.files
        if (files) setFileUrls(Array.from(files).map(file => URL.createObjectURL(file)))
    }

    useEffect(() => {
        if (fileUrls.length) {
            socketHandler.current.emit('mobileClientFileUpload', roomId, fileUrls)
        }
    }, [fileUrls]);

    useEffect(() => {
        if (!socketHandler.current) return
        handleSocketConnection()
    }, [socketHandler.current]);

        useEffect(() => {
            window.addEventListener('beforeunload', () => {
                socketHandler.current.emit('leave-room', roomId)
            })
            return () => {
                window.removeEventListener('beforeunload', () => {})
            }
        },[])


    return <div className='flex flex-col'>
        <h1>Send It</h1>
        <input type='file' multiple onInput={handleFiles} accept="" />
    </div>
}
