'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ActionButton, Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { TableFilter } from "@/app/components/TableFilter";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Alert } from "../../components/Alert";
import { CustomPagination } from "../../components/CustomPagination";
import { Empty } from "../../components/Empty";
import { Loading } from "../../components/Loading";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { CustomTable, HeadTb, TableRow } from "../../components/MyTable";
import { IUsers } from "../../types/auth";
import { toastErrorConfig, toastSuccessConfig } from "../../utils/utility";
import { deleteUserAction, getUserAction } from "./operator.service";

export default function Operator(){
    const router = useRouter();
    const [data, setData] = useState<IUsers[]>([]);
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
        else if (page) {
            page = page + 1;
        }

        setLoading(true);
        getUserAction(
            {
                limit: limit.value,
                nama: keyword,
                pagenumber: page || 1
            },
            (data)=>{
                console.log('page = ', page);
                
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
        deleteUserAction(
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
        router.push('/master-data/operator/edit?id='+id);
    }

    const gotoTambah = () => {
        router.push('/master-data/operator/tambah');
    }

    useEffect(()=>{
        document.title = "Users | SIPELARANG";
    },[]);

    return(
        <BaseContainer>
            <CustomBreadcumb title="Users"/>
            <BaseCard>
            
                <div className="w-[220px] mb-4">
                    <Button 
                        label="Tambah User"
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
                            <th className="text-sm font-robotomedium py-2">Nama User</th>
                            <th className="text-sm font-robotomedium py-2">Lokasi Outlet</th>
                            <th className="text-sm font-robotomedium py-2">Email</th>
                            <th className="text-sm font-robotomedium py-2">Role</th>
                            <th className="text-sm font-robotomedium py-2">Aksi</th>
                        </tr>
                    </HeadTb>
                    <tbody>
                        {data.map((item, index)=> {
                            let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit.value;
                            return(
                                <TableRow key={item.name} strip={index%2 == 1}>
                                    <td className="pl-4 py-2">{startingNumber+index+1}</td>
                                    <td className="py-2">{item.name}</td>
                                    <td className="py-2">{item.nama_dermaga || '-'}</td>
                                    <td className="py-2">{item.email}</td>
                                    <td className="py-2">{item.nama_role}</td>
                                    <td className="py-2 pr-2">
                                        <div>
                                            <ActionButton 
                                                label="Aksi"
                                                outline={true}
                                                onDelete={()=>confirmDelete(item.id, item.name)}
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
                title="Hapus User"
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