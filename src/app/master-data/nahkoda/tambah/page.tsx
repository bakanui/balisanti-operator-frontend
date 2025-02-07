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
import { IKecakapan } from "@/app/types/nahkoda";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createNahkodaAction, getKecakapanNahkodaAction } from "../nahkoda.service";

export default function AddNahkoda(){
    const router = useRouter();
    const [namaNahkoda, setNamaNahkoda] = useState('');
    const [email, setEmail] = useState('');
    const [noTelepon, setNoTelepon] = useState('');
    const [kecakapan, setKecakapan] = useState<IOptions[]>([]);
    const [selectedKecakapan, setSelectedKecakapan] = useState({ value: '', label: 'Pilih Data' });
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');

    useEffect(()=> {
        setLoading(true);
        getKecakapanNahkodaAction(
            {
                limit: 100
            },
            (data)=> {
                let tmp = data.data.map((item: IKecakapan)=> ({
                    value: item.id,
                    label: item.nama_kecakapan
                }))
                setKecakapan(tmp);
                setLoading(false);
            },
            ()=> {
                setLoading(false);
            },
            ()=> router.replace('/login')
        );
    }, []);

    useEffect(()=>{
        document.title = "Tambah Nahkoda | SIPELARANG";
    },[]);

    const save = () => {
        if (!namaNahkoda || !email || !noTelepon || !status || !selectedKecakapan) {
            toast.error('Pastikan Anda sudah mengisi semua data!', toastErrorConfig);
            return;
        }
        setLoadingMessage('Menyimpan Data...');
        setLoading(true);
        createNahkodaAction(
            {
                nama_nahkoda: namaNahkoda,
                no_telp: noTelepon,
                email: email,
                password: 'empty12213%',
                id_kecakapan: selectedKecakapan.value,
                status_nahkoda: status.value
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
            },
            ()=> router.replace('/login')
        );
    }

    const back = () => {
        router.back();
    }

    return(
        <BaseContainer>
            <CustomBreadcumb
             title="Tambah Data Nahkoda"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama Nahkoda"
                    placeholder="Masukkan nama nahkoda"
                    onChangeText={(e)=>setNamaNahkoda(e.target.value)}
                    value={namaNahkoda}
                />
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <Input 
                        label="Nomor Telepon"
                        placeholder="Masukkan nomor telepon nahkoda"
                        onChangeText={(e)=>setNoTelepon(e.target.value)}
                        value={noTelepon}
                    />
                    <Input 
                        label="Email Nahkoda"
                        placeholder="Masukkan email nahkoda jika ada"
                        onChangeText={(e)=>setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <SelectBox 
                    label="Kecakapan"
                    placeholder="Pilih data"
                    option={kecakapan}
                    value={selectedKecakapan}
                    onChange={setSelectedKecakapan}
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