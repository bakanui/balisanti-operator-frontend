'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { editKecakapanAction, getDetailKecakapanAction } from "../kecakapan.service";

export default function EditKecakapan(){
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [namaKecakapan, setNamaKecakapan] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true);
        getDetailKecakapanAction(
            queryParams.get('id'),
            (data) => {
                setNamaKecakapan(data.nama_kecakapan);
                setLoading(false);
            },
            (err) => {
                setLoading(false);
                toast.error(err, toastErrorConfig);
            },
            ()=> router.replace('/login')
        );
    },[]);

    const save = () => {
        if (!namaKecakapan) {
            toast.error('Pastikan Anda sudah mengisi semua data!', toastErrorConfig);
            return;
        }
        setLoading(true);
        editKecakapanAction(
            {
                id: queryParams.get('id'),
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
             title="Edit Kecakapan"
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