import { IAuth } from '@/app/types/auth';
import { IKapal } from '@/app/types/kapal';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import axios from 'axios';
import { API_SIWALATRI } from '../../utils/api';

export const getKapalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: ()=> void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any>(API_MASTER_DATA.KAPAL,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET KAPAL = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, ()=> {
            onUnAuth && onUnAuth();
        });
        onFailed(err);
    });
}

export const createKapalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: ()=> void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAuth>(API_MASTER_DATA.KAPAL, 
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
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, ()=> {
            onUnAuth && onUnAuth();
        });
        onFailed(err);
    });
}

export const createKapalSiwalatriAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: ()=> void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAuth>(API_SIWALATRI.MASTER_KAPAL, 
        {...params}
    )
    .then((response)=> {
        onSuccess(response.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, ()=> {
            onUnAuth && onUnAuth();
        });
        onFailed(err);
    });
}


export const deleteKapalAction = (
    id: string,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: ()=> void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IAuth>(API_MASTER_DATA.KAPAL, 
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
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, ()=> {
            onUnAuth && onUnAuth();
        });
        onFailed(err);
    });
}

export const getDetailKapalAction = (
    id: number,
    onSuccess: (data: IKapal) => void,
    onFailed: (error:any) => void,
    onUnAuth?: ()=> void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IKapal}>(API_MASTER_DATA.KAPAL+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET DETAIL KAPAL = ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, ()=> {
            onUnAuth && onUnAuth();
        });
        onFailed(err);
    });
}

export const editKapalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: ()=> void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IAuth>(API_MASTER_DATA.KAPAL, 
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
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, ()=> {
            onUnAuth && onUnAuth();
        });
        onFailed(err);
    });
}