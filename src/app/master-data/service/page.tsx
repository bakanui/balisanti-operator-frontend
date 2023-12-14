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
import { IHargaService } from "@/app/types/hargaService";
import { convertLabelToPrice, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { deleteHargaServiceAction, getHargaServiceAction } from "./hargaService.service";

export default function Service(){
    const router = useRouter();
    const [data, setData] = useState<IHargaService[]>([]);
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
        getHargaServiceAction(
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
        deleteHargaServiceAction(
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
        router.push('/master-data/service/edit?id='+id);
    }

    const gotoTambah = () => {
        router.push('/master-data/service/tambah');
    }

    return(
        <BaseContainer>
            <CustomBreadcumb title="Harga Service"/>
            <BaseCard>
            
                <div className="w-[220px] mb-4">
                    <Button 
                        label="Tambah Harga Service"
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
                            <th className="text-sm font-robotomedium py-2">Area Penjemputan</th>
                            <th className="text-sm font-robotomedium py-2">Dermaga Tujuan</th>
                            <th className="text-sm font-robotomedium py-2">Harga</th>
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
                                <td className="py-2">{item.area_jemput}</td>
                                <td className="py-2">{item.nama_dermaga}</td>
                                <td className="py-2">Rp. {convertLabelToPrice(`${item.harga}`)}</td>
                                <td className="py-2">
                                    <Badge 
                                        text={item.status_service == 1 ? 'Aktif' : 'Tidak Aktif'}
                                        status={item.status_service == 1}
                                    />
                                </td>
                                <td className="py-2 pr-2">
                                    <div>
                                        <ActionButton 
                                            label="Aksi"
                                            outline={true}
                                            onDelete={()=>confirmDelete(item.id, item.nama_dermaga)}
                                            onEdit={()=>gotoEdit(item.id)}
                                        />
                                    </div>
                                </td>
                            </TableRow>
                        );
                    })}
                    </tbody>
                </CustomTable>
                </>}
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