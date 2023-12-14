import { IAuth } from '@/app/types/auth';
import { API_MASTER_DATA } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import { IAgen } from '@/app/types/agen';
import axios from 'axios';

export const getAgenAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    console.log('disini = ', auth);
        
    axios.get<IAgen[]>(API_MASTER_DATA.AGEN,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET AGEN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}

export const createAgenAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAgen>(API_MASTER_DATA.AGEN, 
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

export const deleteAgenAction = (
    id: number,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IAgen>(API_MASTER_DATA.AGEN, 
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
        process.env.NODE_ENV && console.log('DELETE AGEN = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}

export const getDetailAgenAction = (
    id: number,
    onSuccess: (data: IAgen) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IAgen}>(API_MASTER_DATA.AGEN+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('DETAIL AGEN = ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}

export const editAgenAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IAgen>(API_MASTER_DATA.AGEN, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('EDIT AGEN = ', response);

        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}