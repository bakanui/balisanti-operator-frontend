'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { PriceInput } from "@/app/components/PriceInput";
import { Radio } from "@/app/components/Radio";
import { SelectBox } from "@/app/components/SelectBox";
import { STATUS } from "@/app/constants/status";
import { convertLabelPriceToNumeberPrice, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createAgenAction } from "../agen.service";

export default function AddAgen(){
    const router = useRouter();
    const [namaAgen, setNamaAgen] = useState('');
    const [nomorTelepon, setNomorTelepon] = useState('');
    const [email, setEmail] = useState('');
    const [jenisPenguranganHarga, setJenisPenguranganHarga] = useState<'nominal' | 'persen'>('nominal');
    const [maksHutang, setMaksHutang] = useState('');
    const [persentasePotongan, setPersentasePotongan] = useState('');
    const [nominal, setNominal] = useState('');
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);

    const save = () => {
        if (!namaAgen || !nomorTelepon || !email || !jenisPenguranganHarga || !status) {
            toast.error('Pastikan Anda sudah mengisi semua data!', toastErrorConfig);
            return;
        }
        setLoading(true);
        createAgenAction(
            {
                nama_agen: namaAgen,
                no_telp: nomorTelepon,
                email: email,
                batas_limit: convertLabelPriceToNumeberPrice(maksHutang),
                jenis_diskon: jenisPenguranganHarga,
                nominal_diskon: jenisPenguranganHarga == 'nominal' ? convertLabelPriceToNumeberPrice(nominal) : persentasePotongan,
                status_agen: status.value
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
             title="Tambah Agen"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama Agen"
                    placeholder="Masukkan nama agen"
                    onChangeText={(e)=>setNamaAgen(e.target.value)}
                    value={namaAgen}
                />
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <Input 
                        label="Nomor Telepon"
                        placeholder="Masukkan nomor telepon agen"
                        onChangeText={(e)=>setNomorTelepon(e.target.value)}
                        value={nomorTelepon}
                    />
                    <Input 
                        label="Email"
                        placeholder="Masukkan email agen"
                        onChangeText={(e)=>setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <PriceInput 
                    label="Batas Maksimal Limit Hutang"
                    placeholder="Rp. 10.000.000"
                    disabled={false}
                    onChangeText={(e)=>setMaksHutang(e)}
                    value={maksHutang}
                />
                <div className="font-robotomedium text-sm">Jenis Pengurangan Harga</div>
                <div className="flex mb-6 mt-2">
                    <Radio 
                        text="Nominal (Rp)"
                        selected={jenisPenguranganHarga == 'nominal'}
                        onClick={()=>setJenisPenguranganHarga('nominal')}
                    />
                    <div className="ml-6"/>
                    <Radio 
                        text="Persentase (%)"
                        selected={jenisPenguranganHarga == 'persen'}
                        onClick={()=>setJenisPenguranganHarga('persen')}
                    />
                </div>
                {jenisPenguranganHarga == 'nominal' ? 
                    <PriceInput 
                        label="Masukkan Nominal"
                        placeholder="Rp. 2.000.000"
                        disabled={false}
                        onChangeText={(e)=>setNominal(e)}
                        value={nominal}
                    />
                    :
                    <Input 
                        label="Persentase (%)"
                        placeholder="50%"
                        onChangeText={(e)=>setPersentasePotongan(e.target.value)}
                        value={persentasePotongan}
                    />
                }
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