import { IAgen } from "@/app/types/agen";
import { API_MASTER_DATA } from "@/app/utils/api";
import axios from "axios";
import { useState } from "react";
import { useAuth, useError } from "./global.hook";

export const useAgen = () => {
    const [token] = useAuth();
    const [agen, setAgen] = useState<IAgen[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPage: 0,
        currentPage: 1
    });
    const {handleError} = useError();

    const getAgen = async (
        params: any,
        page?: number
    ) => {
        setLoading(true);
        try {
            const res = await axios.get<{data:any}>(API_MASTER_DATA.AGEN,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params
            });
            const result:any = res.data;
            setAgen(result.data);
            setPagination({
                totalItems: result.cnt,
                totalPage: result.totalPage,
                currentPage: page || 1
            });
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }
    return [agen, loading, pagination, getAgen]
}