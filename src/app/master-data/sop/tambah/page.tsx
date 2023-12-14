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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createSopAction } from "../sop.service";

export default function AddSOP(){
    const router = useRouter();
    const [namaSop, setNamaSop] = useState('');
    const [keterangan, setKeterangan] = useState(''); 
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);

    const save = () => {
        if (!namaSop || !keterangan || !status) {
            toast.error('Pastikan Anda sudah mengisi semua data!', toastErrorConfig);
            return;
        }
        setLoading(true);
        createSopAction(
            {
                nama_sop: namaSop,
                deskripsi_sop: keterangan,
                status_sop: status.value
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
             title="Tambah SOP"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama SOP"
                    placeholder="Masukkan nama SOP"
                    onChangeText={(e)=>setNamaSop(e.target.value)}
                    value={namaSop}
                />
                <Input 
                    label="Keterangan"
                    placeholder="Masukkan keterangan"
                    onChangeText={(e)=>setKeterangan(e.target.value)}
                    value={keterangan}
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
                title="Menyimpan Data..."
            />
            <ToastContainer/>
        </BaseContainer>
    );
}