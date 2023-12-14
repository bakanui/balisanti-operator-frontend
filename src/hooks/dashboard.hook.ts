import { IAgen } from "@/app/types/agen";
import { API_DASHBOARD, API_MASTER_DATA } from "@/app/utils/api";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth, useError } from "./global.hook";

export interface IDashboardData {
    kapals: {
        nama_kapal: string;
        mesin: string;
        nama_jenis_kapal: string;
        kapasitas_penumpang: number;
        status_kapal: number;
    };
    jadwals: {
        waktu_berangkat: string;
        rute: string;
        nama_nahkoda: string;
        nama_kapal: string;
    };
    pendapatan: string;
}

interface IuseDashboard {
    data: IDashboardData;
    loading: boolean;
    setParams: any;
    getData: any;
}

export const useDashboard = () => {
    const [token] = useAuth();
    const [data, setData] = useState({
        kapals: [],
        jadwals: [],
        pendapatan: '0'
    });
    const [loading, setLoading] = useState(false);
    const {handleError} = useError();
    const [params, setParams] = useState(null);

    useEffect(()=> {
        if (params) {
            getData(params);
        }
    }, [params]);

    const getData: any = async (
        params: any,
    ) => {
        setLoading(true);
        try {
            const res = await axios.get<{data:any}>(API_DASHBOARD.DASHBOARD,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params
            });
            const result:any = res.data;
            console.log('dahsboard = ', result);
            setData(result);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }
    return [data, setParams, loading, getData]
}