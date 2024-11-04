import { IAuth } from '@/app/types/auth';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import { IHargaService } from '@/app/types/hargaService';
import axios from 'axios';

export const getHargaServiceAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    unAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IHargaService[]>(API_MASTER_DATA.HARGA_SERVICE,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET HARGA SERVICE = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, () => unAuth && unAuth());
        onFailed(err);
    });
}

export const createHargaServiceAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    unAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IHargaService>(API_MASTER_DATA.HARGA_SERVICE, 
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
        let err = errorHandler(error, () => unAuth && unAuth());
        onFailed(err);
    });
}

export const deleteHargaServiceAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    unAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IHargaService>(API_MASTER_DATA.HARGA_SERVICE, 
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
        process.env.NODE_ENV && console.log('DELETE HARGA SERVICE = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, () => unAuth && unAuth());
        onFailed(err);
    });
}

export const getDetailHargaServiceAction = (
    id: number,
    onSuccess: (data: IHargaService) => void,
    onFailed: (error:any) => void,
    unAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IHargaService}>(API_MASTER_DATA.HARGA_SERVICE+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('DETAIL HARGA SERVICE = ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, () => unAuth && unAuth());
        onFailed(err);
    });
}

export const editHargaServiceAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    unAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IHargaService>(API_MASTER_DATA.HARGA_SERVICE, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('EDIT HARGA SERVICE = ', response);

        onSuccess(response.data);
    })
    .catch(function (error) {
        process.env.NODE_ENV && console.log(error);
        let err = errorHandler(error, () => unAuth && unAuth());
        onFailed(err);
    });
}