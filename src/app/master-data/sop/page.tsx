'use client'
import { Alert } from "@/app/components/Alert";
import { Badge } from "@/app/components/Badge";
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ActionButton, Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { CustomPagination } from "@/app/components/CustomPagination";
import { Empty } from "@/app/components/Empty";
import { Loading } from "@/app/components/Loading";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { TableFilter } from "@/app/components/TableFilter";
import { ISop } from "@/app/types/sop";
import { parseDateIncludeHours, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { deleteSopAction, getSopAction } from "./sop.service";

export default function SOP(){
    const router = useRouter();
    const [data, setData] = useState<ISop[]>([]);
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

    const debouncedSearch = useRef(
        debounce(async (e) => {
            setKeyword(e.target.value);
        }, 500)
    ).current;

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
        getSopAction(
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

    const confirmDelete = (id: number, name: string) => {
        setTmpDeleteData({id, name});
        setShowAlert(true);
    }

    const deleteData = () => {
        setShowAlert(false);
        setLoadingDelete(true);
        deleteSopAction(
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

    const gotoEdit = (id: number) => {
        router.push('/master-data/sop/edit?id='+id);
    }

    const gotoTambah = () => {
        router.push('/master-data/sop/tambah');
    }

    return(
        <BaseContainer>
            <CustomBreadcumb title="SOP"/>
            <BaseCard>
                <div className="w-[180px] mb-4">
                    <Button 
                        label="Tambah SOP"
                        icon={faPlus}
                        onClick={gotoTambah}
                    />
                </div>
                <TableFilter 
                    onChange={debouncedSearch}
                    limitChange={(e)=>setLimit({value: e.target.value, label: e.target.value})}
                />
                {loading ? 
                    <Loading
                        loading={loading}
                        title="Memuat Data"
                    />
                :
                <>
                <CustomTable>
                    <HeadTb>
                        <tr>
                            <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                            <th className="text-sm font-robotomedium py-2">Nama SOP</th>
                            <th className="text-sm font-robotomedium py-2">Tanggal Dibuat</th>
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
                                    <td className="py-2">{item.nama_sop}</td>
                                    <td className="py-2">{parseDateIncludeHours(new Date(item.created_at), true)}</td>
                                    <td className="py-2">
                                        <Badge 
                                           text={item.status_sop == 1 ? 'Aktif' : 'Tidak Aktif'}
                                           status={item.status_sop == 1}
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <div>
                                            <ActionButton 
                                                label="Aksi"
                                                outline={true}
                                                onDelete={()=>confirmDelete(item.id, item.nama_sop)}
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
                </>
                }
            </BaseCard>
            <Alert
                title="Hapus Dermaga"
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
            <ToastContainer/>
        </BaseContainer>
    );
}