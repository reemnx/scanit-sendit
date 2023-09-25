import {io, Socket} from "socket.io-client";
import {useEffect, useRef, useState} from "react";
import {socketEvents} from "../../socket.events.ts";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Lottie from 'react-lottie-player'
import AnimationData from '../../assets/lottie/bg-scan.json'
import ClipLoader from "react-spinners/ClipLoader";

function generateRandomID(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomID = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomID += characters.charAt(randomIndex);
    }
    return randomID;
}

export const ScanIt = () => {
    const [qrImgData, setQrImgData] = useState<string>('')
    const [isClientLive, setIsClientLive] = useState<boolean>(false)
    const [roomId, setRoomId] = useState(generateRandomID(8))
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

    const socketHandler = useRef<Socket>(io('http://localhost:3080'))

    const handleSocketConnection = () => {
        socketHandler.current.emit(socketEvents.JOIN_ROOM, roomId)
        socketHandler.current.on(socketEvents.REC_QR_DATA, (imgData) => {
            setTimeout(() => {
                setQrImgData(imgData)
            }, 1200)

        })
        socketHandler.current.on(socketEvents.CLIENT.CLIENT_UP,
            () => {
            setIsClientLive(true)
        })

        socketHandler.current.on(socketEvents.CLIENT.CLIENT_DOWN,
            () => {
            setIsClientLive(false)
        })

        socketHandler.current.on('clientFiles', (fileUrls) => {
            setUploadedFiles(fileUrls)
        })

        socketHandler.current.emit(socketEvents.GEN_QR_DATA, roomId)
    }

    const handleRefreshQrCode = () => {
        const newId = generateRandomID(8)
        setQrImgData('')
        socketHandler.current.emit('leave-room', roomId)
        setRoomId(newId)
    }

    useEffect(() => {
        if (!roomId) return
        handleSocketConnection()
    }, [roomId]);

    useEffect(() => {
        if (!socketHandler.current) return
        handleSocketConnection()
    }, [socketHandler]);

    return (
        <div className='flex flex-col grow h-full bg-white rounded-md items-center justify-center relative'>
            <Lottie animationData={AnimationData} play loop style={{position: "absolute", inset: 0, background: "#1f1f1f", borderRadius: '12px'}} />
            {!uploadedFiles.length && <div className='z-50'>
            <h1 className='font-sans text-[48px] mb-[34px] text-white z-[999]'>{isClientLive ? 'Finish Upload' : 'Scan It'}</h1>
            {qrImgData && !isClientLive && <div className='flex items-center justify-center w-[280px] h-[280px] rounded-[12px] color-change-2x border-[2px] border-white fade-In z-[999] mb-[24px]'>
            <img className='w-[230px] rounded-[12px] slide-in-left' src={qrImgData} alt='QR Code' />
            </div>}
            {!qrImgData && <Skeleton className='z-[999]' width='280px' height='280px' highlightColor='#FE455666'  />}
            {isClientLive && <ClipLoader
                color='#FFFFFF'
                loading
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
            />}
            {qrImgData && !isClientLive && <button className='text-white text-sm bg-blue-400 px-[20px] py-[12px] z-[999]' onClick={handleRefreshQrCode}>Refresh QR Code</button>}
            </div>}
            {uploadedFiles.length && uploadedFiles.map(file => {
                return <img src={file} className='w-[100px] z-10' />
            })}
        </div>
    )
}
