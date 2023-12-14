import { IAuth } from '@/app/types/auth';
import { IJenisKapal } from '@/app/types/kapal';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import axios from 'axios';

export const getJenisKapalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any>(API_MASTER_DATA.JENIS_KAPAL,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET JENIS KAPAL = ', response);
        
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createJenisKapalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAuth>(API_MASTER_DATA.JENIS_KAPAL, 
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
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const deleteJenisKapalAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IAuth>(API_MASTER_DATA.JENIS_KAPAL, 
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
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailJenisKapalAction = (
    id: number,
    onSuccess: (data: IJenisKapal) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IJenisKapal}>(API_MASTER_DATA.JENIS_KAPAL+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editJenisKapalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IAuth>(API_MASTER_DATA.JENIS_KAPAL, 
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
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}