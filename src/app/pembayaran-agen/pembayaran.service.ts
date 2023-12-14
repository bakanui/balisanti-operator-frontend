import { IAuth } from '@/app/types/auth';
import { IInvoice, IPembayaranAgen, IPenjualanTiket, IRekapTagihan } from '@/app/types/jadwal';
import { API_PEMBAYARAN, API_PENJUALAN_TIKET } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import axios from 'axios';

export const getPembayaranAgenAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IPembayaranAgen[]>(API_PEMBAYARAN.PEMBAYARAN_AGEN,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET PEMBAYARAN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getListInvoiceAgenAction = (
    agen_id: number,
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any>(API_PEMBAYARAN.LIST_INVOICE+'/'+agen_id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET LIST INVOICE PEMBAYARAN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getInvoiceDetailAction = (
    invoice_id: string,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any>(API_PEMBAYARAN.INVOICE+''+invoice_id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        }
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET INVOICE DETAIL PEMBAYARAN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createPembayaranAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    let formData: any = new FormData();
    formData.append('no_invoice', params.no_invoice);
    formData.append('metode_bayar', params.metode_bayar);
    formData.append('nominal', `${params.nominal}`);
    if (params.bukti_bayar) {
        formData.append('bukti_bayar', params.bukti_bayar);
    }
    axios.post<IAuth>(API_PEMBAYARAN.BAYAR, 
        formData,
        {
            headers: {
                'Authorization': `Bearer ${auth.authorisation.token}`,
                'Content-Type': 'multipart/form-data',
            }
        }
    )
    .then((response)=> {
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailPembayaranAction = (
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
        process.env.NODE_ENV && console.log('detail PEMBAYARAN = ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getRekapTagihanAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IRekapTagihan[]>(API_PEMBAYARAN.REKAP_TAGIHAN,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET REKAP TAGUHAN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getInvoiceSuggestionAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any>(API_PEMBAYARAN.LIST_INVOICE_SUGGESTION,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET INVOICE SUGGESTION = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}