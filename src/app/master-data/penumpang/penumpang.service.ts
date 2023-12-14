import { IAuth } from '@/app/types/auth';
import { IJenisPenumpang, IPenumpang } from '@/app/types/penumpang';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import axios from 'axios';

export const getJenisPenumpangAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IJenisPenumpang[]>(API_MASTER_DATA.JENIS_PENUMPANG,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET JENIS PENUMPANG = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createJenisPenumpangAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAuth>(API_MASTER_DATA.JENIS_PENUMPANG, 
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
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const deleteJenisPenumpangAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IJenisPenumpang>(API_MASTER_DATA.JENIS_PENUMPANG, 
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
        process.env.NODE_ENV && console.log('delete JENIS PENUMPANG = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailJenisPenumpangAction = (
    id: number,
    onSuccess: (data: IJenisPenumpang) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IJenisPenumpang}>(API_MASTER_DATA.JENIS_PENUMPANG+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('detail JENIS PENUMPANG = ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailPenumpangByPhone = (
    no_telepon: string,
    onSuccess: (data: IPenumpang) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get(API_MASTER_DATA.PENUMPANG,
    {
        params: {
            no_telepon: no_telepon,
        },
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('PENUMPANG = ', response.data);
        onSuccess(response.data[0]);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editJenisPenumpangAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IJenisPenumpang>(API_MASTER_DATA.JENIS_PENUMPANG, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('edit JENIS PENUMPANG = ', response);

        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}