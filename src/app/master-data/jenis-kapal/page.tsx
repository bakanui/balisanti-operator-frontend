'use client'
import { Alert } from "@/app/components/Alert";
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ActionButton, Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { Loading } from "@/app/components/Loading";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { TableFilter } from "@/app/components/TableFilter";
import { IJenisKapal } from "@/app/types/kapal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { TableRow } from "@/app/components/MyTable";
import { deleteJenisKapalAction, getJenisKapalAction } from "./jenis-kapal.service";
import { debounce } from "lodash"
import { Empty } from "@/app/components/Empty";

export default function JenisKapal(){
    const router = useRouter();
    const [data, setData] = useState<IJenisKapal[]>([]);
    const [loading, setLoading] = useState(true);
    const [tmpDeleteData, setTmpDeleteData] = useState({
        id: 0,
        namaKapal: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [limit, setLimit] = useState({value: '10', label: '10'});

    const debouncedSearch = useRef(
        debounce(async (e) => {
            setKeyword(e.target.value);
        }, 500)
    ).current;

    useEffect(()=>{
        getData();
    },[]);

    useEffect(()=>{
        getData();
    },[keyword, limit]);

    useEffect(() => {
        return () => {
          debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const getData = () => {
        setLoading(true);
        getJenisKapalAction(
            {
                limit: limit.value,
                nama: keyword
            },
            (data)=>{
                setData(data.data);
                setLoading(false);
            },
            ()=>{
                setLoading(false);
            },
            ()=> router.replace('/login')
        );
    }

    const gotoAddKapal = () => {
        router.push('/master-data/jenis-kapal/tambah');
    }

    const gotoEdit = (id: number) => {
        router.push('/master-data/jenis-kapal/edit?id='+id);
    }

    const confirmDelete = (id: number, namaKapal: string) => {
        setTmpDeleteData({id, namaKapal});
        setShowAlert(true);
    }

    const deleteKapal = () => {
        setShowAlert(false);
        setLoadingDelete(true);
        deleteJenisKapalAction(
            tmpDeleteData.id,
            ()=>{
                setLoadingDelete(false);
                toast.success('Berhasil menghapus data', toastSuccessConfig);
                getData();
            },
            (err)=>{
                setLoadingDelete(false);
                toast.error(err, toastErrorConfig);
            }
        );
    }

    return(
        <BaseContainer>
            <CustomBreadcumb title="Jenis Kapal"/>
            <BaseCard>
            
                <div className="w-[200px]">
                    <Button 
                        label="Tambah Jenis Kapal"
                        icon={faPlus}
                        onClick={gotoAddKapal}
                    />
                </div>
                
                <hr className="my-4"/>
                <TableFilter 
                    onChange={debouncedSearch}
                    limitChange={(e)=>setLimit({value: e.target.value, label: e.target.value})}
                />
                {loading ? 
                    <Loading 
                        loading
                        title="Memuat Data..."
                    />
                :
                <table className="border-collapse w-full p-8 my-4 text-left">
                    <thead className="border border-[black] border-x-0 ">
                        <tr>
                            <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                            <th className="text-sm font-robotomedium py-2">Jenis Kapal</th>
                            <th className="text-sm font-robotomedium py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index)=>{
                            return(
                                <TableRow key={item.id} strip={index%2 == 1}>
                                    <td className="pl-4 py-2">{index+1}</td>
                                    <td className="py-2">{item.nama_jenis_kapal}</td>
                                    <td className="py-2 pr-2">
                                        <div>
                                            <ActionButton 
                                                label="Aksi"
                                                outline={true}
                                                onDelete={()=>confirmDelete(item.id, item.nama_jenis_kapal)}
                                                onEdit={()=>gotoEdit(item.id)}
                                            />
                                        </div>
                                    </td>
                                </TableRow>
                            );
                        })}
                    </tbody>
                </table>
                }
                {!loading && data.length == 0 ? 
                    <Empty
                        title="Tidak ada data ditemukan"
                    />
                : null}
            </BaseCard>
            <Alert
                title="Hapus Jenis Kapal"
                content={`Apakah Anda yakin ingin menghapus ${tmpDeleteData.namaKapal} ?`}
                confirmText="Ya"
                cancelText="Tidak"
                isOpen={showAlert}
                closeAlert={()=>setShowAlert(false)}
                confirmAlert={deleteKapal}
            />
            <LoadingOverlay
                loading={loadingDelete}
                title="Menghapus Data..."
            />
            <ToastContainer />
        </BaseContainer>
    );
}