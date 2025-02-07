'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { editJenisKapalAction, getDetailJenisKapalAction } from "../jenis-kapal.service";

export default function EditJenisKapal(){
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [jenisKapal, setjenisKapal] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getDetail();        
    },[]);

    const getDetail = () => {
        setLoading(true);
        getDetailJenisKapalAction(
            queryParams.get('id'),
            (data)=>{
                setjenisKapal(data.nama_jenis_kapal);
                document.title = "Edit " + data.nama_jenis_kapal + " | SIPELARANG";
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
        setLoading(true);
        const params = {
            id: queryParams.get('id'),
            nama_jenis_kapal: jenisKapal,
        };
        editJenisKapalAction(
            params,
            ()=>{
                toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                setLoading(false);
                back();
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
             title="Edit Jenis Kapal"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama Kapal"
                    placeholder="Masukkan nama kapal"
                    onChangeText={(e)=>setjenisKapal(e.target.value)}
                    value={jenisKapal}
                />
            </BaseCard>
            <ButtonGroup 
                onCancel={back}
                onConfirm={save}
            />
            <LoadingOverlay
                loading={loading}
                title="Mohon Menunggu..."
            />
            <ToastContainer />
        </BaseContainer>
    );
}