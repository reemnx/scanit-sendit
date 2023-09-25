import {RouterProvider} from 'react-router-dom'
import {ROUTES} from "./router/routes.tsx";
import {useState} from "react";
function App() {
    const [isNavMini, setIsNavMini] = useState<boolean>(false)
    const minimizeNav = () => {
        setIsNavMini(prevState => !prevState)
    }

  return (
    <div className='flex items-center bg-gray-100 w-screen h-screen'>
        <nav className={`${isNavMini ? 'basis-[80px]' : 'basis-[240px]'} transition-all duration-150 ease-in h-full border-r border-gray-300 bg-white flex flex-col items-center`}>
            <button onClick={minimizeNav} className='bg-blue-400'>Minimize</button>
        </nav>
        <div className='grow h-full py-[24px] px-[24px]'>
        <RouterProvider router={ROUTES} />
        </div>
    </div>
  )
}

export default App
