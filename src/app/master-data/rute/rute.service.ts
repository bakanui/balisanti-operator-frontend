import { IAuth } from '@/app/types/auth';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import { IRute } from '@/app/types/rute';
import axios from 'axios';

export const getRuteAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IRute[]>(API_MASTER_DATA.RUTE,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET RUTE = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createRuteAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IRute>(API_MASTER_DATA.RUTE, 
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

export const deleteRuteAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IRute>(API_MASTER_DATA.RUTE, 
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
        process.env.NODE_ENV && console.log('DELETE RUTE = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailRuteAction = (
    id: number,
    onSuccess: (data: IRute) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IRute}>(API_MASTER_DATA.RUTE+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('DETAIL RUTE = ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editRuteAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IRute>(API_MASTER_DATA.RUTE, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('EDIT RUTE = ', response);

        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}