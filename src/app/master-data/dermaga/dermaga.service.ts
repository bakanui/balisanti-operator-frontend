import { IAuth } from '@/app/types/auth';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import { IDermaga } from '@/app/types/dermaga';
import axios from 'axios';

export const getDermagaAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    if (!auth) {
        onUnAuth && onUnAuth();
        return;
    }
    
    axios.get<IDermaga[]>(API_MASTER_DATA.DERMAGA,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET DERMAGA = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createDermagaAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAuth>(API_MASTER_DATA.DERMAGA, 
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

export const deleteDermagaAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IDermaga>(API_MASTER_DATA.DERMAGA, 
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
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailDermagaAction = (
    id: number,
    onSuccess: (data: IDermaga) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IDermaga}>(API_MASTER_DATA.DERMAGA+'/view/'+id,
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
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editDermagaAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IDermaga>(API_MASTER_DATA.DERMAGA, 
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
        let err = errorHandler(error, () => onUnAuth && onUnAuth());
        onFailed(err);
    });
}