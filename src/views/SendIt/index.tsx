import {useParams} from "react-router-dom";
import React, {useEffect, useCallback, useRef} from "react";
import {io, Socket} from "socket.io-client"
import {socketEvents} from "../../socket.events.ts";
import axios from "axios";
const axiosInstance = axios.create({withCredentials: true})

export const SendIt = () => {
    const {roomId} = useParams()

    const socketHandler = useRef<Socket>(io())

    const handleSocketConnection = useCallback(() => {
        socketHandler.current.emit(socketEvents.JOIN_ROOM, roomId)
        setTimeout(() => {
            socketHandler.current.emit(socketEvents.CLIENT.CONNECT, roomId)
        }, 500)
    }, [])

    const handleFiles = async (e: React.FormEvent<HTMLInputElement>) => {
        const data = e.target as HTMLInputElement
        const files = data.files
        const formData = new FormData()
        if (files) {
            Array.from(files).forEach(file => {
                formData.append('files', file)
            })
            const res = await axiosInstance.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log('res Client', res)
            socketHandler.current.emit('mobileClientFileUpload', roomId, res.data)
        }
    }

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
