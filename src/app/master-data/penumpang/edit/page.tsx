'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { SelectBox } from "@/app/components/SelectBox";
import { STATUS } from "@/app/constants/status";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { editJenisPenumpangAction, getDetailJenisPenumpangAction } from "../penumpang.service";

export default function EditJenisPenumpang(){
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [tipe, setTipe] = useState({ value: '', label: 'Pilih Data' });
    const [jenis, setJenis] = useState({ value: '', label: 'Pilih Data' });
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getData();
    },[]);

    const back = () => {
        router.back();
    }

    const getData = () => {
        setLoading(true);
        getDetailJenisPenumpangAction(
            queryParams.get('id'),
            (data)=>{
                setTipe({
                    value: data.tipe,
                    label: data.tipe
                });
                setJenis({
                    value: data.jenis,
                    label: data.jenis
                });
                setStatus({
                    value: `${data.status_jenis_penumpang}`,
                    label: data.status_jenis_penumpang == 1 ? 'Aktif' : 'Tidak Aktif'
                });
                setLoading(false);
            },
            ()=>{
                setLoading(false);
            }
        );
    }

    const save = () => {
        if (!tipe.value || !jenis.value) {
            toast.error('Pastikan Anda sudah memilih Tipe dan Jenis Penumpang!', toastErrorConfig);
            return;
        }
        setLoading(true);
        editJenisPenumpangAction(
            {
                id: queryParams.get('id'),
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
             title="Edit Jenis Penumpang"
             onBack={back}
             />
            <BaseCard>
                <SelectBox 
                    label="Tipe Penumpang"
                    placeholder="Pilih tipe penumpang"
                    option={[
                        {value: 'Dewasa', label: 'Dewasa'},
                        {value: 'Anak-anak', label: 'Anak-anak'},
                    ]}
                    value={tipe}
                    onChange={setTipe}
                />
                <SelectBox 
                    label="Jenis Penumpang"
                    placeholder="Pilih jenis penumpang"
                    option={[
                        {value: 'Lokal', label: 'Lokal'},
                        {value: 'Mancanegara', label: 'Mancanegara'},
                    ]}
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