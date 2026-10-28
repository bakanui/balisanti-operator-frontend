'use client'
import { Alert } from "@/app/components/Alert";
import { Badge } from "@/app/components/Badge";
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ActionButton, Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { Loading } from "@/app/components/Loading";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { TableFilter } from "@/app/components/TableFilter";
import { IJenisPenumpang } from "@/app/types/penumpang";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { deleteJenisPenumpangAction, getJenisPenumpangAction } from "./penumpang.service";
import { CustomPagination } from "@/app/components/CustomPagination";
import { Empty } from "@/app/components/Empty";
import { OpsiPenumpangTab } from "./components/OpsiPenumpangTab";

const TABS = [
    {key: 'jenis-penumpang', label: 'Jenis Penumpang'},
    {key: 'tipe', label: 'Opsi Tipe Penumpang'},
    {key: 'jenis', label: 'Opsi Jenis Penumpang'},
] as const;

export default function Penumpang(){
    const router = useRouter();
    const [data, setData] = useState<IJenisPenumpang[]>([]);
    const [loading, setLoading] = useState(true);
    const [tmpDeleteData, setTmpDeleteData] = useState({
        id: 0,
        name: ''
    });
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPage: 0,
        currentPage: 1
    });
    const [keyword, setKeyword] = useState('');
    const [limit, setLimit] = useState({value: 10, label: '10'});
    const [showAlert, setShowAlert] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [tab, setTab] = useState<typeof TABS[number]['key']>('jenis-penumpang');

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
    },[keyword, limit.value]);

    useEffect(() => {
        return () => {
          debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const getData = (page?: number) => {
        if (page && typeof page != 'number') {
            page = 1;
        }
        setLoading(true);
        getJenisPenumpangAction(
            {
                limit: limit.value,
                nama: keyword,
                pagenumber: page || 1
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
            }
        );
    }

    const gotoTambahJenis = () => {
        router.push('/master-data/penumpang/tambah');
    }

    const gotoEdit = (id: number) => {
        router.push('/master-data/penumpang/edit?id='+id);
    }

    const confirmDelete = (id: number, name: string) => {
        setTmpDeleteData({id, name});
        setShowAlert(true);
    }

    const deleteData = () => {
        setShowAlert(false);
        setLoadingDelete(true);
        deleteJenisPenumpangAction(
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
            <CustomBreadcumb title="Jenis Penumpang"/>
            <BaseCard>
                <div className="flex flex-row flex-wrap border-b border-gray-200 mb-4">
                    {TABS.map((item)=>(
                        <button
                            key={item.key}
                            onClick={()=>setTab(item.key)}
                            className={`px-4 py-2 text-sm -mb-px border-b-2 ${tab == item.key ? 'border-primary text-primary font-robotomedium' : 'border-transparent font-robotoregular hover:text-primary'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
                {tab == 'tipe' ? <OpsiPenumpangTab kategori="tipe" title="Tipe Penumpang" /> : null}
                {tab == 'jenis' ? <OpsiPenumpangTab kategori="jenis" title="Jenis Penumpang" /> : null}
                {tab == 'jenis-penumpang' ? <>
                <div className="w-[220px] mb-4">
                    <Button 
                        label="Tambah Jenis Penumpang"
                        icon={faPlus}
                        onClick={gotoTambahJenis}
                    />
                </div>
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
                <CustomTable>
                    <HeadTb>
                        <tr>
                            <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                            <th className="text-sm font-robotomedium py-2">Tipe Penumpang</th>
                            <th className="text-sm font-robotomedium py-2">Jenis Penumpang</th>
                            <th className="text-sm font-robotomedium py-2">Status</th>
                            <th className="text-sm font-robotomedium py-2">Aksi</th>
                        </tr>
                    </HeadTb>
                    <tbody>
                        {data.map((item, index)=> {
                            let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit.value;
                            return(
                                <TableRow key={item.id} strip={index%2 == 1}>
                                    <td className="pl-4 py-2">{startingNumber+index+1}</td>
                                    <td className="py-2">{item.tipe}</td>
                                    <td className="py-2">{item.jenis}</td>
                                    <td className="py-2">
                                        <Badge 
                                            text={item.status_jenis_penumpang == 1 ? 'Aktif' : 'Tidak Aktif'}
                                            status={item.status_jenis_penumpang == 1}
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <div>
                                            <ActionButton 
                                                label="Aksi"
                                                outline={true}
                                                onDelete={()=>confirmDelete(item.id, `${item.tipe} - ${item.jenis}`)}
                                                onEdit={()=>gotoEdit(item.id)}
                                            />
                                        </div>
                                    </td>
                                </TableRow>
                            );
                        })}
                    </tbody>
                </CustomTable>
                {!loading && data.length == 0 ? 
                    <Empty
                        title="Tidak ada data ditemukan"
                    />
                : null}
                <CustomPagination
                    totalItems={pagination.totalItems}
                    totalPage={pagination.totalPage}
                    onPageChange={(e)=>getData(e.selected)}
                    limit={limit.value}
                    totalData={data.length}
                    currentPage={pagination.currentPage}
                />
                </>}
                </> : null}
            </BaseCard>
            <Alert
                title="Hapus Jenis Penumpang"
                content={`Apakah Anda yakin ingin menghapus  ${tmpDeleteData.name} ?`}
                confirmText="Ya"
                cancelText="Tidak"
                isOpen={showAlert}
                closeAlert={()=>setShowAlert(false)}
                confirmAlert={deleteData}
            />
            <LoadingOverlay
                loading={loadingDelete}
                title="Menghapus Data..."
            />
            <ToastContainer />
        </BaseContainer>
    );
}