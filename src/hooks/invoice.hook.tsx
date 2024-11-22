import { IAuth } from "@/app/types/auth";
import { IPenumpang } from "@/app/types/jadwal";
import { API_LAPORAN, API_PEMBAYARAN, API_TIKET_PENUMPANG } from "@/app/utils/api";
import { getStorageValue } from "@/app/utils/localstoreage";
import axios from "axios";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { useAuth, useError } from "./global.hook";
import fileDownload from 'js-file-download';
import { errorHandler } from '@/app/utils/utility';
interface IProps {
    invoice: string;
}

export const UseInvoice = (props: IProps) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect(()=>{
        (
        async function(){
            try{
                setLoading(true)
                const auth: IAuth = getStorageValue('auth');
                const response = await axios.get<any>(API_PEMBAYARAN.INVOICE+''+props.invoice,
                {
                    headers: {
                        Authorization: `Bearer ${auth.authorisation.token}`,
                    }
                });
                setData(response.data);
                setLoading(false);
            }
            catch(err: any){
                setError(err)
            }finally{
                setLoading(false)
            }
        }
        )()
    },[]);

    return { data }
}

interface IUseInvoiceDetailProps {
    invoice?: string;
}
export const useInvoiceDetail = (props: IUseInvoiceDetailProps) => {
    const [detail, setDetail] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const {handleError} = useError();
    const [token] = useAuth();
    const {toLogin} = useError();
    
    const getDetail = async(invoice_id: string)=> {
        const auth: IAuth = getStorageValue('auth');
        let activeToken = null;
        
        if (auth && auth.authorisation && auth.authorisation.token) {
            activeToken = auth.authorisation.token;
        } else {
            toLogin();
        }
        try{
            setLoading(true)
            const response = await axios.get<any>(API_PEMBAYARAN.INVOICE+''+invoice_id,
            {
                headers: {
                    Authorization: `Bearer ${token || activeToken}`,
                }
            });
            setDetail(response.data);
        }
        catch(err: any){
            setError(err);
            handleError(err);
        }finally{
            setLoading(false);
        }
    }

    return [detail, getDetail, loading, error];
}

export const useCancelPassanger = () => {
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const {handleError} = useError();
    const [token] = useAuth();

    const cancelPassanger:any = async(passanger: IPenumpang, callback?: ()=> void)=> {
        try{
            setLoading(true)
            const response = await axios.put<any>(API_TIKET_PENUMPANG.EDIT_TIKET,
                {
                    kode_booking: passanger.kode_booking,
                    nama_penumpang: passanger.nama_penumpang,
                    no_identitas: passanger.no_identitas,
                    jenis_kelamin: passanger.jenis_kelamin,
                    email: passanger.email,
                    payment: "cash",
                    cancel: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success('Data penumpang dengan kode booking : ' +passanger.kode_booking+ ' berhasil dicancel');
            callback && callback();
        }
        catch(err: any){
            setError(err);
            handleError(err);
        }finally{
            setLoading(false);
        }
    }

    return [cancelPassanger, loading, error];
}

export const useDownloadMultipleInvoice = () => {
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const {handleError} = useError();
    const [token] = useAuth();

    const download: any = async(invoiceNumber: string)=> {
        try{
            setLoading(true)
            const response = await axios.get<any>(API_PEMBAYARAN.DONWLOAD_MULTIPLE_INVOICE+'?no_invoice='+invoiceNumber,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob'
            });
            fileDownload(response.data, 'invoices.pdf');
        }
        catch(err: any){
            setError(err);
            handleError(err);
        }finally{
            setLoading(false);
        }
    }

    return [download, loading, error];
}

export const handleDownloadManifest = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
 ) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any[]>(API_LAPORAN.DOWNLOAD_MANIFEST+''+params.id_jadwal,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params,
        responseType: 'blob'
    })
    .then((response)=> {
        // process.env.NODE_ENV && console.log('GET getPenumpangByJadwalAction = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
    // const [loading, setLoading] = useState(false);
    // const [error,setError] = useState(null);
    // const {handleError} = useError();
    // const [token] = useAuth();

    // const download: any = async()=> {
    //     setLoading(true)
    //     const response = await axios.get<any>(API_LAPORAN.DOWNLOAD_MANIFEST+''+params.id_jadwal,
    //     {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //         params,
    //         responseType: 'blob'
    //     });
    //     fileDownload(response.data, 'invoices.pdf');
    // }

    // return [download, loading, error];
}

export const handleDownloadGT = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
 ) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<any[]>(API_LAPORAN.DOWNLOAD_GT, 
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

export const handleDownloadJasa = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
 ) => {
    const auth: IAuth = getStorageValue('auth');
    axios.post<any[]>(API_LAPORAN.DOWNLOAD_JASA, 
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

export const handleDownloadManifestPembayaran = (
    params: any,
    onSuccess: (data: any) => void,
    onFailed: (error:any) => void,
    onUnAuth?: () => void
 ) => {
    const auth: IAuth = getStorageValue('auth');
    axios.get<any[]>(API_LAPORAN.DOWNLOAD_MANIFEST_PEMBAYARAN+''+params.id_jadwal,
    {
        headers: {
            Authorization: `Bearer ${auth.authorisation.token}`,
        },
        params,
        responseType: 'blob'
    })
    .then((response)=> {
        // process.env.NODE_ENV && console.log('GET getPenumpangByJadwalAction = ', response);
        onSuccess(response.data);
    })
    .catch(function (error) {
        let err = errorHandler(error, ()=> onUnAuth && onUnAuth());
        onFailed(err);
    });
    // const [loading, setLoading] = useState(false);
    // const [error,setError] = useState(null);
    // const {handleError} = useError();
    // const [token] = useAuth();

    // const download: any = async()=> {
    //     setLoading(true)
    //     const response = await axios.get<any>(API_LAPORAN.DOWNLOAD_MANIFEST+''+params.id_jadwal,
    //     {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //         params,
    //         responseType: 'blob'
    //     });
    //     fileDownload(response.data, 'invoices.pdf');
    // }

    // return [download, loading, error];
}