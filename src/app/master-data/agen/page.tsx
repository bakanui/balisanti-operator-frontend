'use client'
import { Alert } from "@/app/components/Alert";
import { Badge } from "@/app/components/Badge";
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ActionButton, Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { CustomModal } from "@/app/components/CustomModal";
import { CustomPagination } from "@/app/components/CustomPagination";
import { Loading } from "@/app/components/Loading";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { TableFilter } from "@/app/components/TableFilter";
import { IAgen } from "@/app/types/agen";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { deleteAgenAction, getAgenAction } from "./agen.service";
import { DetailModal } from "./components/DetailModal";
import { Empty } from "@/app/components/Empty";

export default function Agen(){
    const router = useRouter();
    const [data, setData] = useState<IAgen[]>([]);
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
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState<IAgen | null>(null);
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
        }  else if (page) {
            page = page + 1;
        }
        setLoading(true);
        getAgenAction(
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
        deleteAgenAction(
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
        router.push('/master-data/agen/edit?id='+id);
    }

    const gotoTambah = () => {
        router.push('/master-data/agen/tambah');
    }

    const openDetail = (item: IAgen) => {
        console.log(item);
        setModalData(item);
        setShowModal(true);
    }

    return(
        <BaseContainer>
            <CustomBreadcumb title="Data Agen"/>
            <BaseCard>
                <div className="w-[220px] mb-4">
                    <Button 
                        label="Tambah Agen"
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
                            <th className="text-sm font-robotomedium py-2">Nama Agen</th>
                            <th className="text-sm font-robotomedium py-2">No. Telp</th>
                            <th className="text-sm font-robotomedium py-2">Email</th>
                            <th className="text-sm font-robotomedium py-2">Status</th>
                            <th className="text-sm font-robotomedium py-2">Aksi</th>
                        </tr>
                    </HeadTb>
                    <tbody>
                    {data.map((item, index)=> {
                            let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit.value;
                            return(
                                <TableRow key={item.id} strip={index%2 == 1} onClick={()=>openDetail(item)}>
                                    <td className="pl-4 py-2">{startingNumber+index+1}</td>
                                    <td className="py-2">{item.nama_agen}</td>
                                    <td className="py-2">{item.no_telp}</td>
                                    <td className="py-2">{item.email}</td>
                                    <td className="py-2">
                                        <Badge 
                                            text={item.status_agen == 1 ? 'Aktif' : 'Tidak Aktif'}
                                            status={item.status_agen == 1}
                                        />
                                    </td>
                                    <td className="py-2 pr-2">
                                        <div>
                                            <ActionButton 
                                                label="Aksi"
                                                outline={true}
                                                onDelete={()=>confirmDelete(item.id, item.nama_agen)}
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
            <CustomModal
                modalIsOpen={showModal}
                closeModal={()=>setShowModal(false)}
            >
                <DetailModal 
                    item={modalData}
                    closeModal={()=>setShowModal(false)}
                />
            </CustomModal>
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