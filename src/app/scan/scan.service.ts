import { IAuth } from '@/app/types/auth';
import { IPenjualanTiket } from '@/app/types/jadwal';
import { API_MASTER_DATA, API_PEMBAYARAN, API_PENJUALAN_TIKET } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import { IAgen } from '@/app/types/agen';
import axios from 'axios';

export const getPenjualanAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IPenjualanTiket[]>(API_PENJUALAN_TIKET.CARI_JADWAL,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET PENJUALAN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const scanTiketAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any[]>(API_PEMBAYARAN.SCAN_TIKET+'?kode_booking='+params.kode_booking,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('SCAN TIKET = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        onFailed(error);
    });
}

export const scanTiketUsingURLAction = (
    url: string,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any[]>(url,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('SCAN TIKET USING URL = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}