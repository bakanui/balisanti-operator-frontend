import { IAuth, IUsers } from '@/app/types/auth';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import { IAgen } from '@/app/types/agen';
import axios from 'axios';

export const getUserAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IUsers[]>(API_MASTER_DATA.USERS,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET USERS =', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createUserAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAgen>(API_MASTER_DATA.USERS, 
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

export const deleteUserAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IAgen>(API_MASTER_DATA.USERS, 
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
        process.env.NODE_ENV && console.log('DELETE USERS =', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailUserAction = (
    id: number,
    onSuccess: (data: IUsers) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IUsers}>(API_MASTER_DATA.USERS+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('DETAIL USERS =', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editUserAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IAgen>(API_MASTER_DATA.USERS, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('EDIT USERS =', response);

        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}