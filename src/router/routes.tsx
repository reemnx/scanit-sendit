import {
    createBrowserRouter,
} from "react-router-dom";
import {ScanIt} from "../views/ScanIt";
import {SendIt} from "../views/SendIt";
export const ROUTES = createBrowserRouter([
    {
        path: '/scan-it',
        element: <ScanIt />
    },
    {
        path: '/send-it/:roomId?',
        element: <SendIt />
    },
    {
        path: '*',
        element: <h1>404</h1>
    }
])
