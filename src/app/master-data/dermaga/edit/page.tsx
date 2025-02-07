'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { SelectBox } from "@/app/components/SelectBox";
import { STATUS } from "@/app/constants/status";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { editDermagaAction, getDetailDermagaAction } from "../dermaga.service";

export default function EditDermaga(){
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [nama, setNama] = useState('');
    const [lokasi, setLokasi] = useState('');
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');

    useEffect(()=>{
        getData();
    },[]);

    const getData = () => {
        setLoading(true);
        getDetailDermagaAction(
            queryParams.get('id'),
            (data)=>{
                setNama(data.nama_dermaga);
                document.title = "Edit " + data.nama_dermaga + " | SIPELARANG";
                setLokasi(data.lokasi_dermaga);
                setStatus({
                    value: `${data.status_dermaga}`,
                    label: data.status_dermaga == 1 ? 'Aktif' : 'Tidak Aktif'
                });
                setLoading(false);
            },
            ()=>{
                setLoading(false);
            }
        );
    }

    const back = () => {
        router.back();
    }

    const save = () => {
        if (!nama || !lokasi || !status) {
            toast.error('Pastikan Anda sudah mengisi semua data!', toastErrorConfig);
            return;
        }
        setLoadingMessage('Menyimpan Data...');
        setLoading(true);
        editDermagaAction(
            {
                id: queryParams.get('id'),
                nama_dermaga: nama,
                lokasi_dermaga: lokasi,
                status_dermaga: status.value
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

    return(
        <BaseContainer>
            <CustomBreadcumb
             title="Tambah Data Dermaga"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama Dermaga"
                    placeholder="Masukkan nama dermaga"
                    onChangeText={(e)=>setNama(e.target.value)}
                    value={nama}
                />
                <Input 
                    label="Lokasi Dermaga"
                    placeholder="Masukkan lokasi dermaga"
                    onChangeText={(e)=>setLokasi(e.target.value)}
                    value={lokasi}
                />
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
                title={loadingMessage}
            />
            <ToastContainer />
        </BaseContainer>
    );
}