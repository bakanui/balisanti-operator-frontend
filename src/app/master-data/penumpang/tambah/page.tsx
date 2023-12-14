'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { SelectBox } from "@/app/components/SelectBox";
import { JENIS_PENUMPANG } from "@/app/constants/jenisPenumpang";
import { STATUS } from "@/app/constants/status";
import { TIPE_PENUMPANG } from "@/app/constants/tipePenumpang";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createJenisPenumpangAction } from "../penumpang.service";

export default function AddJenisPenumpang(){
    const router = useRouter();
    const [tipe, setTipe] = useState({ value: '', label: 'Pilih Data' });
    const [jenis, setJenis] = useState({ value: '', label: 'Pilih Data' });
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);

    const back = () => {
        router.back();
    }

    const save = () => {
        if (!tipe.value || !jenis.value) {
            toast.error('Pastikan Anda sudah memilih Tipe dan Jenis Penumpang!', toastErrorConfig);
            return;
        }
        setLoading(true);
        createJenisPenumpangAction(
            {
                tipe: tipe.value,
                jenis: jenis.value,
                status_jenis_penumpang: status.value
            },
            ()=>{
                setLoading(false);
                toast.success('Data Berhasil Disimpan', toastSuccessConfig);
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
             title="Tambah Jenis Penumpang"
             onBack={back}
             />
            <BaseCard>
                <SelectBox 
                    label="Tipe Penumpang"
                    placeholder="Pilih tipe penumpang"
                    option={TIPE_PENUMPANG}
                    value={tipe}
                    onChange={setTipe}
                />
                <SelectBox 
                    label="Jenis Penumpang"
                    placeholder="Pilih jenis penumpang"
                    option={JENIS_PENUMPANG}
                    value={jenis}
                    onChange={setJenis}
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
            <ToastContainer />
        </BaseContainer>
    );
}