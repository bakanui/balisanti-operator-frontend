'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CustomPagination } from "../components/CustomPagination";
import { DatePicker } from "../components/DatePicker";
import { Empty } from "../components/Empty";
import { Loading } from "../components/Loading";
import { SelectBox } from "../components/SelectBox";
import { getDermagaAction } from "../master-data/dermaga/dermaga.service";
import { IOptions } from "../types/auth";
import { IDermaga } from "../types/dermaga";
import { IPenjualanTiket } from "../types/jadwal";
import { getStorageValue, setStorageValue } from "../utils/localstoreage";
import { parseDateToBackendFormat, timeList, toastErrorConfig, isBeforeCurrentDate, isBeforeCurrentTime } from "../utils/utility";
import { TiketCard } from "./components/TiketCard";
import { getPenjualanAction } from "./penjualanTiket.service";

export default function PenjualanTiket(){
    const router = useRouter();
    const [data, setData] = useState<IPenjualanTiket[]>([]);
    const [dermaga, setDermaga] = useState<IOptions[]>([
        {value: '', label: 'Semua'}
    ]);
    const [dermagaAwal, setDermagaAwal] = useState<IOptions>({value: '', label: 'Semua'});
    const [dermagaTujuan, setDermagaTujuan] = useState<IOptions>({value: '', label: 'Semua'});
    const [waktuKeberangkatan, setWaktuKeberangkatan] = useState<IOptions>({value: '', label: 'Semua'});
    const [tanggalKeberangkatan, setTanggalKeberangkatan] = useState<Date>(new Date());
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPage: 0,
        currentPage: 1
    });
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        setLoading(true);
        getDermagaAction(
            {
                limit: 100,
                status: 1
            },
            (data)=> {
                setDermaga(data.data.map((item: IDermaga)=> ({
                    value: item.id,
                    label: item.nama_dermaga
                })));
                let tmp = getStorageValue('auth');
                if (tmp) {
                    if (tmp.user.id_role == 1) {
                        setLoading(false);
                        return;
                    }
                    if (tmp.user.id_role == 2) {
                        setTanggalKeberangkatan(new Date());
                    }
                    getData();
                }
            },
            ()=> {
                setLoading(false);
            },
            ()=> router.replace('/login')
        );
    },[]);

    const getData = (page?: number) => {
        if (page && typeof page != 'number') {
            page = 1;
        }
        setLoading(true);
        getPenjualanAction(
            {
                limit: 100,
                dermaga_asal: dermagaAwal.value || undefined,
                dermaga_tujuan: dermagaTujuan.value || undefined,
                jam: waktuKeberangkatan.value || undefined,
                tanggal: tanggalKeberangkatan ? parseDateToBackendFormat(tanggalKeberangkatan) : undefined
            },
            (data)=>{
                if (!data.data) {
                    setData([]);
                } else {
                    let fusion: IPenjualanTiket[] = [];
                    if (isBeforeCurrentDate(tanggalKeberangkatan)) {
                        data.data.map((item: any) => {
                            if(!isBeforeCurrentTime(item.waktu_berangkat)){
                                fusion.push(item);
                            }
                        });
                        setData(fusion);
                        setPagination({
                            totalItems: data.cnt | 1,
                            totalPage: data.totalPage | 1,
                            currentPage: page || 1
                        });
                    } else {
                        setData(data.data);
                        setPagination({
                            totalItems: data.cnt,
                            totalPage: data.totalPage,
                            currentPage: page || 1
                        });
                    }
                }
                setLoading(false);
            },
            (err)=>{
                setLoading(false);
                toast.error('err', toastErrorConfig);
            },
            () => router.replace('/login')
        );
    }

    const gotoDetail = (item: IPenjualanTiket) => {
        setStorageValue('tiket', JSON.stringify(item));
        setStorageValue('tanggalKeberangkatan', tanggalKeberangkatan);
        router.push('/penjualan-tiket/tambah?id='+item.id_jadwal);
    }

    const cariData = () => {
        getData();
    }

    return(
        <BaseContainer>
            <CustomBreadcumb title="Penjualan Tiket" noRoute/>
            <BaseCard>
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <SelectBox
                        label="Dermaga Asal"
                        placeholder="Semua"
                        option={[
                            {value: '', label: 'Semua'},
                            ...dermaga
                        ]}
                        onChange={setDermagaAwal}
                    />
                    <SelectBox 
                        label="Dermaga Tujuan"
                        placeholder="Semua"
                        option={[
                            {value: '', label: 'Semua'},
                            ...dermaga
                        ]}
                        onChange={setDermagaTujuan}
                    />
                    <DatePicker 
                        label="Tanggal Keberangkatan"
                        onChange={setTanggalKeberangkatan}
                        value={tanggalKeberangkatan}
                    />
                    <SelectBox 
                        label="Waktu Keberangkatan"
                        placeholder="Semua"
                        option={[
                            {value: '', label: 'Semua'},
                            ...timeList
                        ]}
                        onChange={setWaktuKeberangkatan}
                    />
                </div>
                <Button 
                    label="Cari Tiket"
                    onClick={cariData}
                />
            </BaseCard>
            <div className="mb-4"/>
            <CustomBreadcumb title="Tiket Tersedia" noRoute/>
            {loading ? 
                <Loading 
                    title="Memuat Data..."
                    loading={true}
                />
            : 
            data.length > 0 ?
                <>
                <div className="grid gap-x-6 gap-y-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
                    {data.map((item)=> {
                        return(
                            <TiketCard 
                                key={item.id}
                                onClick={()=> gotoDetail(item)}
                                jadwal={item}
                            />
                        );
                    })}
                </div> 
                <CustomPagination
                    totalItems={pagination.totalItems}
                    totalPage={pagination.totalPage}
                    onPageChange={(e)=>getData(e.selected)}
                    limit={100}
                    totalData={data.length}
                    currentPage={pagination.currentPage}
                />
                </>
                :
                <Empty 
                    title="Tidak ada data jadwal!"
                    subtitle="Atau silakan cari jadwal terlebih dahulu!"
                />
            }
            <ToastContainer/>
        </BaseContainer>
    );
}