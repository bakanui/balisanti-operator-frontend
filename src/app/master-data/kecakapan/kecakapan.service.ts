import { IAuth } from '@/app/types/auth';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import { IKecakapan } from '@/app/types/nahkoda';
import axios from 'axios';

export const getKecakapanAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IKecakapan[]>(API_MASTER_DATA.KECAKAPAN,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET KECAKAPAN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createKecakapanAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IKecakapan>(API_MASTER_DATA.KECAKAPAN, 
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
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const deleteKecakapanAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IKecakapan>(API_MASTER_DATA.KECAKAPAN, 
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
        process.env.NODE_ENV && console.log('DELETE KECAKAPAN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailKecakapanAction = (
    id: number,
    onSuccess: (data: IKecakapan) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IKecakapan}>(API_MASTER_DATA.KECAKAPAN+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('DETAIL KECAKAPAN = ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editKecakapanAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IKecakapan>(API_MASTER_DATA.KECAKAPAN, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('EDIT KECAKAPAN = ', response);

        onSuccess(response.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}