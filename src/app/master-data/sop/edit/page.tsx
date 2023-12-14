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
import { createSopAction, editSopAction, getDetailSopAction } from "../sop.service";

export default function EditSOP(){
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [namaSop, setNamaSop] = useState('');
    const [keterangan, setKeterangan] = useState(''); 
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');

    useEffect(()=>{
        getDetail();
    }, []);

    const getDetail = () => {
        getDetailSopAction(
            queryParams.get('id'),
            (data)=>{
                setNamaSop(data.nama_sop);
                setKeterangan(data.deskripsi_sop);
                setStatus({
                    value: `${data.status_sop}`,
                    label: data.status_sop == 1 ? 'Aktif' : 'Tidak Aktif'
                });
                setLoading(false);
            },
            ()=>{
                setLoading(false);
            }
        );
    }


    const save = () => {
        if (!namaSop || !keterangan || !status) {
            toast.error('Pastikan Anda sudah mengisi semua data!', toastErrorConfig);
            return;
        }
        setLoadingMessage('Menyimpan Data...');
        setLoading(true);
        editSopAction(
            {
                id: queryParams.get('id'),
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
             title="Edit SOP"
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
                title={loadingMessage}
            />
            <ToastContainer/>
        </BaseContainer>
    );
}