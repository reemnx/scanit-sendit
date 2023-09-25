import {io, Socket} from "socket.io-client";
import {useCallback, useEffect, useState} from "react";
import {socketEvents} from "../../socket.events.ts";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Lottie from 'react-lottie-player'
import AnimationData from '../../assets/lottie/bg-scan.json'
import ClipLoader from "react-spinners/ClipLoader";

export const ScanIt = () => {
    const [qrImgData, setQrImgData] = useState<string>('')
    const [isClientLive, setIsClientLive] = useState<boolean>(false)
    const [roomId] = useState('reemsRoom')

    const handleSocketConnection = useCallback((socketHandler: Socket) => {
        socketHandler.emit(socketEvents.JOIN_ROOM, roomId)
        socketHandler.on(socketEvents.REC_QR_DATA, (imgData) => {
            setTimeout(() => {
                setQrImgData(imgData)
            }, 1200)

        })
        socketHandler.on('clientUp', () => {
            setIsClientLive(true)
        })

        socketHandler.on('clientDown', () => {
            console.log('Client is Down')
            setIsClientLive(false)
        })

        socketHandler.emit(socketEvents.GEN_QR_DATA, roomId)
    }, [])


    useEffect(() => {
        const socketHandler = io('http://localhost:3080')
        handleSocketConnection(socketHandler)
    },[])

    return (
        <div className='flex flex-col grow h-full bg-white rounded-md items-center justify-center relative'>
            <Lottie animationData={AnimationData} play loop style={{position: "absolute", inset: 0, background: "#1f1f1f", borderRadius: '12px'}} />
            <h1 className='font-sans text-[48px] mb-[34px] text-white z-[999]'>{isClientLive ? 'Finish Upload' : 'Scan It'}</h1>
            {qrImgData && !isClientLive && <div className='flex items-center justify-center w-[280px] h-[280px] rounded-[12px] color-change-2x border-[2px] border-white fade-In z-[999]'>
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
        </div>
    )
}
