'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { createJenisKapalAction } from "../jenis-kapal.service";

export default function AddJenisKapal(){
    const router = useRouter();
    const [namaJenisKapal, setNamaJenisKapal] = useState('');
    const [loading, setLoading] = useState(false);

    const back = () => {
        router.back();
    }

    const save = () => {
        setLoading(true);
        const params = {
            nama_jenis_kapal: namaJenisKapal,
        };
        createJenisKapalAction(
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
             title="Jenis Kapal"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama Jenis Kapal"
                    placeholder="Masukkan nama jenis kapal"
                    onChangeText={(e)=>setNamaJenisKapal(e.target.value)}
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