'use client'
import { Alert } from "@/app/components/Alert";
import { Badge } from "@/app/components/Badge";
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ActionButton, Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { Loading } from "@/app/components/Loading";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { SecondarySelectBox } from "@/app/components/SecondarySelectBox";
import { TableFilter } from "@/app/components/TableFilter";
import { IJenisKapal, IKapal } from "@/app/types/kapal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { deleteKapalAction, getKapalAction } from "./kapal.service";
import { ToastContainer, toast } from 'react-toastify';
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { TableRow } from "@/app/components/MyTable";
import { debounce } from "lodash";
import { getJenisKapalAction } from "../jenis-kapal/jenis-kapal.service";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { CustomPagination } from "@/app/components/CustomPagination";
import { Empty } from "@/app/components/Empty";

export default function Kapal(){
    const router = useRouter();
    const [data, setData] = useState<IKapal[]>([]);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPage: 0,
        currentPage: 1
    });
    const [loading, setLoading] = useState(true);
    const [tmpDeleteData, setTmpDeleteData] = useState({
        id: '',
        namaKapal: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [limit, setLimit] = useState({value: 10, label: '10'});
    const [jenisKapal, setJenisKapal] = useState([{ value: '', label: 'Semua' }]);
    const [selectedJenisKapal, setSelectedJenisKapal] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const debouncedSearch = useRef(
        debounce(async (e) => {
            setKeyword(e.target.value);
        }, 500)
    ).current;

    useEffect(()=>{
        getKapal();
        getJenisKapal();
    },[]);

    useEffect(()=>{
        getKapal();
    },[keyword, limit.value]);

    useEffect(() => {
        return () => {
          debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const getKapal = (page?: number) => {
        if (page && typeof page != 'number') {
            page = 1;
        }
        setLoading(true);
        getKapalAction(
            {
                limit: limit.value,
                nama: keyword,
                jenis_kapal: selectedJenisKapal,
                status: selectedStatus,
                pagenumber: page || 1.
            },
            (data)=>{
                setData(data.data);
                setPagination({
                    totalItems: data.cnt,
                    totalPage: data.totalPage,
                    currentPage: page || 1
                });
                setLoading(false);
            },
            ()=>{
                setLoading(false);
            },
            ()=> { router.replace('/login') }
        );
    }

    const getJenisKapal = () => {
        getJenisKapalAction(
            {
                limit: 50
            },
            (data)=>{
                let opt: any[] = data.data.map((item: IJenisKapal)=> {
                    return {
                        value: item.id,
                        label: item.nama_jenis_kapal
                    }
                });
                setJenisKapal([...jenisKapal, ...opt]);
            },
            ()=>{}
        );
    }

    const gotoAddKapal = () => {
        router.push('/master-data/kapal/tambah');
    }

    const gotoEditKapal = (id: string) => {
        router.push('/master-data/kapal/edit?id='+id);
    }

    const confirmDelete = (id: string, namaKapal: string) => {
        setTmpDeleteData({id, namaKapal});
        setShowAlert(true);
    }

    const deleteKapal = () => {
        setShowAlert(false);
        setLoadingDelete(true);
        deleteKapalAction(
            tmpDeleteData.id,
            ()=>{
                setLoadingDelete(false);
                toast.success('Berhasil menghapus data', toastSuccessConfig);
                getKapal();
            },
            (err)=>{
                setLoadingDelete(false);
                toast.error(err, toastErrorConfig);
            }
        );
    }

    const resetFilter = () => {
        setSelectedJenisKapal('');
        setSelectedStatus('');
    }

    return(
        <BaseContainer>
            <CustomBreadcumb title="Data Kapal"/>
            <BaseCard>
            
                <div className="w-[200px]">
                    <Button 
                        label="Tambah Data Kapal"
                        icon={faPlus}
                        onClick={gotoAddKapal}
                    />
                </div>
                <div className="sm:grid gap-x-2 grid-cols-2 my-4">
                    <SecondarySelectBox 
                        label="Jenis Kapal"
                        option={jenisKapal}
                        placeholder=''
                        onChange={(e)=>setSelectedJenisKapal(e.target.value)}
                        value={selectedJenisKapal}
                    />
                    <SecondarySelectBox 
                        label="Status"
                        option={[
                            {value: '', label: 'Semua'},
                            {value: '1', label: 'Aktif'},
                            {value: '0', label: 'Tidak Aktif'},
                        ]}
                        placeholder=''
                        onChange={(e)=>setSelectedStatus(e.target.value)}
                        value={selectedStatus}
                    />
                </div>
                <ButtonGroup
                    onCancel={resetFilter}
                    onConfirm={getKapal}
                    cancelText='Reset Filter'
                    confirmText="Filter"
                    noHeight
                />
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
                <>
                <table className="border-collapse w-full p-8 my-4 text-left">
                    <thead className="border border-[black] border-x-0 ">
                        <tr>
                            <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                            <th className="text-sm font-robotomedium py-2">Nama Kapal</th>
                            <th className="text-sm font-robotomedium py-2">Mesin Kapal</th>
                            <th className="text-sm font-robotomedium py-2">Jenis Kapal</th>
                            <th className="text-sm font-robotomedium py-2">Kapasitas</th>
                            <th className="text-sm font-robotomedium py-2">Status</th>
                            <th className="text-sm font-robotomedium py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index)=>{
                            let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit.value;
                            return(
                                <TableRow key={item.id} strip={index%2 == 1}>
                                    <td className="pl-4 py-2">{startingNumber+index+1}</td>
                                    <td className="py-2">{item.nama_kapal}</td>
                                    <td className="py-2">{item.mesin}</td>
                                    <td className="py-2">{item.nama_jenis_kapal}</td>
                                    <td className="py-2">{item.kapasitas_penumpang} orang</td>
                                    <td className="py-2">
                                        <Badge 
                                            text={item.status_kapal == 1 ? "Aktif" : 'Tidak Aktif'}
                                            status={item.status_kapal == 1}
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <div>
                                            <ActionButton 
                                                label="Aksi"
                                                outline={true}
                                                onDelete={()=>confirmDelete(item.id, item.nama_kapal)}
                                                onEdit={()=>gotoEditKapal(item.id)}
                                            />
                                        </div>
                                    </td>
                                </TableRow>
                            );
                        })}
                    </tbody>
                </table>
                {!loading && data.length == 0 ? 
                    <Empty
                        title="Tidak ada data ditemukan"
                    />
                : null}
                <CustomPagination
                    totalItems={pagination.totalItems}
                    totalPage={pagination.totalPage}
                    onPageChange={(e)=>getKapal(e.selected+1)}
                    limit={limit.value}
                    totalData={data.length}
                    currentPage={pagination.currentPage}
                />
                </>
            }
            </BaseCard>
            <Alert
                title="Hapus Kapal"
                content={`Apakah Anda yakin ingin menghapus kapal ${tmpDeleteData.namaKapal} ?`}
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