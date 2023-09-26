import {RouterProvider} from 'react-router-dom'
import {ROUTES} from "./router/routes.tsx";
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'
function App() {
    const queryClient = new QueryClient()
  return (
    <div className='flex items-center bg-gray-100 w-screen h-screen'>
        <div className='grow h-full py-[24px] px-[24px]'>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={ROUTES} />
            </QueryClientProvider>
        </div>
    </div>
  )
}

export default App
