import { IAuth } from '@/app/types/auth';
import { IJadwal } from '@/app/types/jadwal';
import { API_LAYANAN_SANDAR, API_MASTER_DATA, API_SIWALATRI, BASE_AUTH_SIWALATRI } from '@/app/utils/api';
import { getStorageValue } from '@/app/utils/localstoreage';
import { errorHandler } from '@/app/utils/utility';
import axios from 'axios';

export const createSandarAction = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<IAuth>(API_LAYANAN_SANDAR.CREATE_SANDAR, 
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

export const handleDownloadBASandar = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
 ) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<any[]>(API_LAYANAN_SANDAR.DOWNLOAD_BA, 
        {...params},
        {
            headers: {
                Authorization: `Bearer ${auth.authorisation.token}`
            },
            responseType: 'blob'
        }
    )
    .then((response)=> {
        // process.env.NODE_ENV && console.log('GET getPenumpangByJadwalAction = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
}