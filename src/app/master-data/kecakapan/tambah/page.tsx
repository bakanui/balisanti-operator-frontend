'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createKecakapanAction } from "../kecakapan.service";

export default function AddKecakapan(){
    const router = useRouter();
    const [namaKecakapan, setNamaKecakapan] = useState('');
    const [loading, setLoading] = useState(false);

    const save = () => {
        if (!namaKecakapan) {
            toast.error('Pastikan Anda sudah mengisi semua data!', toastErrorConfig);
            return;
        }
        setLoading(true);
        createKecakapanAction(
            {
                nama_kecakapan: namaKecakapan,
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
             title="Tambah Kecakapan"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama Kecakapan"
                    placeholder="Masukkan nama kecakapan"
                    onChangeText={(e)=>setNamaKecakapan(e.target.value)}
                    value={namaKecakapan}
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
            <ToastContainer/>
        </BaseContainer>
    );
}