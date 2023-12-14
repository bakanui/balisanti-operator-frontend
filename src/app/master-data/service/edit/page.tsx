'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { PriceInput } from "@/app/components/PriceInput";
import { SelectBox } from "@/app/components/SelectBox";
import { STATUS } from "@/app/constants/status";
import { IDermaga } from "@/app/types/dermaga";
import { convertLabelPriceToNumeberPrice, convertLabelToPrice, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getDermagaAction } from "../../dermaga/dermaga.service";
import { editHargaServiceAction, getDetailHargaServiceAction } from "../hargaService.service";

export default function EditService(){
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [dermagaTujuan, setDermagaTujuan] = useState([]);
    const [selectedJenisPenumpang, setSelectedJenisPenumpang] = useState({ value: '', label: 'Pilih Data' });
    const [selectedDermagaTujuan, setSelectedDermagaTujuan] = useState({ value: '', label: 'Pilih Data' });
    const [areaPenjemputan, setAreaPenjemputan] = useState('');
    const [harga, setHarga] = useState('');
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');

    useEffect(()=> {
        setLoading(true);
        getDermagaAction(
            {
                limit: 100,
                status: 1
            },
            (data) => {
                setDermagaTujuan(data.data.map((item: IDermaga)=> ({
                    value: item.id,
                    label: item.nama_dermaga
                })));
                getDetailHargaServiceAction(
                    queryParams.get('id'),
                    (data) => {
                        setSelectedJenisPenumpang({
                            value: `${data.id_jenis_penumpang}`,
                            label: data.jenis_penumpang
                        });
                        setSelectedDermagaTujuan({
                            value: `${data.id_dermaga_tujuan}`,
                            label: data.nama_dermaga
                        });
                        setHarga(convertLabelToPrice(`${data.harga}`));
                        setAreaPenjemputan(data.area_jemput);
                        setStatus({
                            value: `${data.status_service}`,
                            label: data.status_service == 1 ? 'Aktif' : 'Tidak Aktif'
                        });
                        setLoading(false);
                    },
                    (err) => {
                        setLoading(false);
                        toast.error(err, toastErrorConfig);
                    },
                    () => {router.replace('/login')},
                );
            },
            (err) => {
                setLoading(false);
                toast.error(err, toastErrorConfig);
            },
            () => router.replace('/login')
        );
    },[]);
    
    const save = () => {
        if (!selectedJenisPenumpang.value || !selectedDermagaTujuan.value || !harga || !areaPenjemputan || !status) {
            toast.error('Pastikan Anda sudah mengisi semua data!', toastErrorConfig);
            return;
        }
        setLoadingMessage('Menyimpan Data...');
        setLoading(true);
        editHargaServiceAction(
            {
                id: queryParams.get('id'),
                id_jenis_penumpang: selectedJenisPenumpang.value,
                area_jemput: areaPenjemputan,
                id_dermaga_tujuan: selectedDermagaTujuan.value,
                harga: convertLabelPriceToNumeberPrice(harga),
                status_service: status.value
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
             title="Tambah Harga Service"
             onBack={back}
             />
            <BaseCard>
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <Input 
                        label="Area Penjemputan"
                        placeholder="Masukkan nama area penjemputan"
                        onChangeText={(e)=>setAreaPenjemputan(e.target.value)}
                        value={areaPenjemputan}
                    />
                    <SelectBox 
                        label="Dermaga Tujuan"
                        placeholder="Pilih data"
                        option={dermagaTujuan}
                        onChange={setSelectedDermagaTujuan}
                        value={selectedDermagaTujuan}
                    />
                </div>
                <PriceInput
                    label="Harga"
                    placeholder="100.000"
                    onChangeText={(text)=>setHarga(text)}
                    value={harga}
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