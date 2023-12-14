'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { SelectBox } from "@/app/components/SelectBox";
import { STATUS } from "@/app/constants/status";
import { IOptions } from "@/app/types/auth";
import { IDermaga } from "@/app/types/dermaga";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getDermagaAction } from "../../dermaga/dermaga.service";
import { createRuteAction } from "../rute.service";

export default function AddRute(){
    const router = useRouter();
    const [namaRute, setNamaRute] = useState('');
    const [dermagaKeberangkatan, setDermagaKeberangkatan] = useState([]);
    const [dermagaTujuan, setDermagaTujuan] = useState([]);
    const [selectedDermagaKeberangkatan, setSelectedDermagaKeberangkatan] = useState({value: '', label: 'Pilih Data'});
    const [selectedDermagaTujuan, setSelectedDermagaTujuan] = useState({value: '', label: 'Pilih Data'});
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        getData();
    }, []);

    const getData = (page?: number) => {
        if (page && typeof page != 'number') {
            page = 1;
        }
        setLoading(true);
        getDermagaAction(
            {
                limit: 100,
            },
            (data)=>{
                setDermagaKeberangkatan(data.data.map((item: IDermaga)=>({ value: item.id, label: item.nama_dermaga })));
                setDermagaTujuan(data.data.map((item: IDermaga)=>({ value: item.id, label: item.nama_dermaga })));
                setLoading(false);
            },
            ()=>{
                setLoading(false);
            }
        );
    }

    const save = () => {
        if (!namaRute || !selectedDermagaKeberangkatan.value || !selectedDermagaTujuan.value || !status) {
            toast.error('Pastikan Anda sudah mengisi semua data!', toastErrorConfig);
            return;
        }
        setLoading(true);
        createRuteAction(
            {
                nama_rute: namaRute,
                id_dermaga_awal: selectedDermagaKeberangkatan.value,
                id_dermaga_tujuan: selectedDermagaTujuan.value,
                status_rute: status.value
            },
            ()=>{
                toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                setTimeout(() => {
                    back();
                }, 500);
                setLoading(false);
            },
            (err)=>{
                setLoading(false);
                toast.error(err, toastErrorConfig);
            }
        );
    }

    const back = () => {
        router.back();
    }

    return(
        <BaseContainer>
            <CustomBreadcumb
             title="Tambah Rute Perjalanan"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama Rute Perjalanan"
                    placeholder="Masukkan nama rute perjalanan"
                    onChangeText={(e)=>setNamaRute(e.target.value)}
                    value={namaRute}
                />
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <SelectBox 
                        label="Dermaga Keberangkatan"
                        placeholder="Pilih data"
                        option={dermagaKeberangkatan.filter((item: IOptions) => item.value != selectedDermagaTujuan.value)}
                        value={selectedDermagaKeberangkatan}
                        onChange={setSelectedDermagaKeberangkatan}
                    />
                    <SelectBox 
                        label="Dermaga Tujuan"
                        placeholder="Pilih data"
                        option={dermagaTujuan.filter((item: IOptions) => item.value != selectedDermagaKeberangkatan.value)}
                        value={selectedDermagaTujuan}
                        onChange={setSelectedDermagaTujuan}
                    />
                </div>
                <SelectBox 
                    label="Status"
                    placeholder="Pilih data"
                    option={STATUS}
                    value={status}
                    onChange={setStatus}
                />
            </BaseCard>
            <ButtonGroup 
                onCancel={back}
                onConfirm={save}
            />
            <LoadingOverlay
                loading={loading}
                title="Menyimpan Data..."
            />
            <ToastContainer />
        </BaseContainer>
    );
}