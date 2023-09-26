import {useMutation} from "react-query";
import axiosInstance from "../../../plugins/axios";

interface IProps {
    payload: FormData;
}
export const useUploadFilesMutation = () =>
    useMutation('useUploadFilesMutation',
    async ({payload}: IProps) => {
        const res = await axiosInstance.post('/upload', payload,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        return res.data
    })
