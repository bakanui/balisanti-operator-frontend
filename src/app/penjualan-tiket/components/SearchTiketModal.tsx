import { Button } from "@/app/components/Button";
import { DatePicker } from "@/app/components/DatePicker";
import { SelectBox } from "@/app/components/SelectBox";
import { getDermagaAction } from "@/app/master-data/dermaga/dermaga.service";
import { IOptions } from "@/app/types/auth";
import { IDermaga } from "@/app/types/dermaga";
import { IPenjualanTiket } from "@/app/types/jadwal";
import { IRute } from "@/app/types/rute";
import { parseDateToBackendFormat, timeList, toastErrorConfig } from "@/app/utils/utility";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Loading } from "@/app/components/Loading";
import { TiketCard } from "./TiketCard";
import { CustomPagination } from "@/app/components/CustomPagination";
import { Empty } from "@/app/components/Empty";
import { getPenjualanAction } from "../penjualanTiket.service";
import { toast } from "react-toastify";

interface IProps {
    rute: IRute;
    tglKebrangkatan: Date;
    waktuKeberangkatan?: string;
    close: () => void;
    onJadwalSelect: (e: any) => void;
}
export const SearchTiketModal = (props: IProps) => {
    const [data, setData] = useState<IPenjualanTiket[]>([]);
    const [dermaga, setDermaga] = useState<IOptions[]>([
        {value: '', label: 'Semua'}
    ]);
    const [dermagaAwal, setDermagaAwal] = useState<IOptions>({value: '', label: 'Semua'});
    const [dermagaTujuan, setDermagaTujuan] = useState<IOptions>({value: '', label: 'Semua'});
    const [waktuKeberangkatan, setWaktuKeberangkatan] = useState<IOptions>({value: props.waktuKeberangkatan || '', label: props.waktuKeberangkatan || ''});
    const [tanggalKeberangkatan, setTanggalKeberangkatan] = useState(props.tglKebrangkatan);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPage: 0,
        currentPage: 1
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
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
                setDermagaAwal({
                    value: props.rute.id_dermaga_tujuan.toString(),
                    label: props.rute.dermaga_tujuan
                });
                setDermagaTujuan({
                    value: props.rute.id_dermaga_awal.toString(),
                    label: props.rute.dermaga_awal
                });
                getData(undefined, true);
            },
            ()=> {
                setLoading(false);
            }
        );
    }, []);

    const getData = (page?: number, init?: boolean) => {
        if (page && typeof page != 'number') {
            page = 1;
        }
        setLoading(true);
        let params = {};
        if (init) {
            params = {
                dermaga_asal: dermagaAwal.value || props.rute.id_dermaga_tujuan,
                dermaga_tujuan: dermagaTujuan.value || props.rute.id_dermaga_awal,
                
            }
        } if (!init) {
            params = {
                dermaga_asal: dermagaAwal.value ? dermagaAwal.value : undefined,
                dermaga_tujuan: dermagaTujuan.value ? dermagaTujuan.value : undefined,
            }
        }
        getPenjualanAction(
            {
                ...params,
                limit: 10,
                jam: waktuKeberangkatan.value || undefined,
                tanggal: parseDateToBackendFormat(tanggalKeberangkatan)
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
            (err)=>{
                setLoading(false);
                toast.error('err', toastErrorConfig);
            }
        );
    }

    const selectTiket = (item: IPenjualanTiket) => {
        props.onJadwalSelect({
            id_tiket: item.id_jadwal,
            id_jadwal: item.id_jadwal,
            tanggal_balik: tanggalKeberangkatan,
            jamBalik: item.waktu_berangkat,
            demagaAsal: { value: item.id_dermaga_awal, label: item.dermaga_awal },
            demagaTujuan: { value: item.id_dermaga_tujuan, label: item.dermaga_tujuan },
            nama_nahkoda: item.nama_nahkoda,
            nama_kapal: item.nama_kapal,
            sisa_kursi: item.sisa_kursi,
            kapasitas_penumpang: item.kapasitas_penumpang
        });
        props.close();
    }

    return(
        <div className="w-[80vw] h-[90vh] p-2 dark:bg-slate-700">
            <div onClick={props.close} className='h-[24px] w-[24px] rounded-full flex justify-center items-center bg-primary absolute right-2 top-2 cursor-pointer'>
                <FontAwesomeIcon className='text-white' icon={faClose}/>
            </div>
            <div className="sm:grid gap-x-6 grid-cols-2">
                <SelectBox
                    label="Dermaga Asal"
                    placeholder="Semua"
                    option={[
                        {value: '', label: 'Semua'},
                        ...dermaga
                    ]}
                    onChange={setDermagaAwal}
                    value={dermagaAwal}
                />
                <SelectBox 
                    label="Dermaga Tujuan"
                    placeholder="Semua"
                    option={[
                        {value: '', label: 'Semua'},
                        ...dermaga
                    ]}
                    onChange={setDermagaTujuan}
                    value={dermagaTujuan}
                />
                <DatePicker
                    label="Tanggal Kembali"
                    onChange={setTanggalKeberangkatan}
                    value={tanggalKeberangkatan}
                    minDate={props.tglKebrangkatan}
                />
                <SelectBox 
                    label="Waktu Kembali"
                    placeholder="Semua"
                    option={[
                        {value: '', label: 'Semua'},
                        ...timeList
                    ]}
                    onChange={setWaktuKeberangkatan}
                    value={waktuKeberangkatan}
                />
            </div>
            <Button
                label="Cari Tiket"
                onClick={getData}
            />
            <div className="w-full h-[1px] bg-slate-300 my-6"/>
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
                                key={item.id_jadwal}
                                onClick={()=> selectTiket(item)}
                                jadwal={item}
                                shadow
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
                />
            }
        </div>
    );
}