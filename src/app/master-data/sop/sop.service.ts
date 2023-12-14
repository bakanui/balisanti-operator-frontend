import { IAuth } from '@/app/types/auth';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import { ISop } from '@/app/types/sop';
import axios from 'axios';

export const getSopAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<ISop[]>(API_MASTER_DATA.SOP,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET SOP = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}

export const createSopAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<ISop>(API_MASTER_DATA.SOP, 
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
        let err = errorHandler(error);
        onFailed(err);
    });
}

export const deleteSopAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<ISop>(API_MASTER_DATA.SOP, 
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
        process.env.NODE_ENV && console.log('DELETE SOP = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}

export const getDetailSopAction = (
    id: number,
    onSuccess: (data: ISop) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: ISop}>(API_MASTER_DATA.SOP+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('DETAIL SOP = ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}

export const editSopAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<ISop>(API_MASTER_DATA.SOP, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('EDIT SOP = ', response);

        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}