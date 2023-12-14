import { IAuth } from '@/app/types/auth';
import { IPenjualanTiket } from '@/app/types/jadwal';
import { API_PENJUALAN_TIKET, API_PRINTER_TIKET, API_SIWALATRI, API_TIKET_PENUMPANG } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
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

export const cetakTiket = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    axios.get(API_PRINTER_TIKET.CETAK,
    {
        params
    })
    .then((response)=> {
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getJenisPenumpangByIdAction = (
    id_tiket: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IPenjualanTiket[]>(API_PENJUALAN_TIKET.JENIS_PENUMPANG+''+id_tiket,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params: {
            status: 1
        }
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET JENIS PENUMPANG BY TIKET = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createPenjualanAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAuth>(API_PENJUALAN_TIKET.PENJUALAN, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createPenjualanSiwalatriAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    axios.post(API_SIWALATRI.PENUMPANG_GROUP, 
        {...params}
    )
    .then((response)=> {
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error);
        onFailed(err);
    });
}

export const deletePenjualanAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IPenjualanTiket>(API_PENJUALAN_TIKET.CARI_JADWAL, 
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            },
            params: {
                id
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('delete PENJUALAN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailPenjualanAction = (
    id: number,
    onSuccess: (data: IPenjualanTiket) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IPenjualanTiket}>(API_PENJUALAN_TIKET.CARI_JADWAL+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('detail PENJUALAN = ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editPenjualanAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IPenjualanTiket>(API_PENJUALAN_TIKET.CARI_JADWAL, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('edit PENJUALAN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editTiketPenumpangAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IPenjualanTiket>(API_TIKET_PENUMPANG.EDIT_INVOICE, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('edit tiket = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}