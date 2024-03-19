import { IAuth } from '@/app/types/auth';
import { IJadwal } from '@/app/types/jadwal';
import { API_MASTER_DATA, API_SIWALATRI, BASE_AUTH_SIWALATRI } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import axios from 'axios';

export const getjadwalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<IJadwal[]>(API_MASTER_DATA.JADWAL,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('GET JADWAL ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const createjadwalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAuth>(API_MASTER_DATA.JADWAL, 
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

export const createjadwalSiwalatriAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void
) => {
    axios.post(API_SIWALATRI.JADWAL_KEBERANGKATAN, 
        {...params}
    )
    .then((response)=> {
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error);
        onFailed(err);
    });
}

export const deletejadwalAction = (
    id: string,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.delete<IJadwal>(API_MASTER_DATA.JADWAL, 
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
        process.env.NODE_ENV && console.log('delete JADWAL ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const getDetailjadwalAction = (
    id: string,
    onSuccess: (data: IJadwal) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<{data: IJadwal}>(API_MASTER_DATA.JADWAL+'/view/'+id,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
    })
    .then((response)=> {
        process.env.NODE_ENV && console.log('detail JADWAL ', response);
        onSuccess(response.data.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editjadwalAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IJadwal>(API_MASTER_DATA.JADWAL, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('edit JADWAL ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const editjadwalSiwalatriAction = (
    id: string,
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.put<IJadwal>(API_SIWALATRI.JADWAL_KEBERANGKATAN + '/edit/' + id, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${BASE_AUTH_SIWALATRI}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('edit JADWAL Siwalatri', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}

export const setJadwalImageAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    let formData: any = new FormData();
    formData.append('id', params.id);
    if (params.image) {
        formData.append('image', params.image);
    }
    const auth: IAuth = getStorageValue('auth');
    axios.post<IJadwal>(API_MASTER_DATA.SET_JADWAL_IMAGE, 
        formData,
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            }
        }
    )
    .then((response)=> {
        process.env.NODE_ENV && console.log('SET JADWAL IMAGE = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}