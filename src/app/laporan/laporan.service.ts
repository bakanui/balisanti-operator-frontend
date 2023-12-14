import { API_MANIFEST } from './../utils/api';
import { IAuth } from '@/app/types/auth';
import { API_LAPORAN, API_PEMBAYARAN, API_PENJUALAN_TIKET } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import axios from 'axios';
import { IDetailLaporanDermaga, IRekapDetailLaporan } from '../types/dermaga';

export const getPenumpangByDermagaAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    let dermaga_id = 0;
    if (auth) {
        if (auth.user) {
            dermaga_id = auth.user.id_dermaga
        }
    }
    
    axios.get<any[]>(API_PEMBAYARAN.LIST_PENUMPANG_DERMAGA+''+dermaga_id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET getPenumpangByDermagaAction = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getPenumpangByJadwalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any[]>(API_PENJUALAN_TIKET.LIST_PENUMPANG_BY_JADWAL+''+params.id_jadwal,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET getPenumpangByJadwalAction = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailLaporanDermagaAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    let dermaga_id = 0;
    if (auth) {
        if (auth.user) {
            dermaga_id = auth.user.id_dermaga
        } else {
            dermaga_id = params.dermaga_id;
        }
    }

    params.id_loket = dermaga_id;
    
    axios.get<IDetailLaporanDermaga[]>(API_LAPORAN.DETAIL_LAPORAN_OPERATOR,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET getPenumpangByDermagaAction = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getRekapDetailLaporanOperatorAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    let dermaga_id = 0;
    if (auth) {
        if (auth.user) {
            dermaga_id = auth.user.id_dermaga
        } else {
            dermaga_id = params.dermaga_id;
        }
    }

    params.id_loket = dermaga_id;
    
    axios.get<IRekapDetailLaporan[]>(API_LAPORAN.REKAP_LAPORAN_OPERATOR,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET getRekapDetailLaporanOperatorAction = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editManifestKedatanganAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post(API_MANIFEST.EDIT_MANIFEST_BULK,
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    ).then((response)=> {
        console.log('POST editManifestKedatanganAction = ', response);
        onSuccess(response.data);
    }).catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getPenumpangByRuteAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any[]>(API_PEMBAYARAN.REPORT_BY_RUTE,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET PENUMPANG BY RUTES = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}