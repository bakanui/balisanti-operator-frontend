'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { SelectBox } from "@/app/components/SelectBox";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createKapalAction } from "../kapal.service";
import { ToastContainer, toast } from 'react-toastify';
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { getJenisKapalAction } from "../../jenis-kapal/jenis-kapal.service";
import { IJenisKapal } from "@/app/types/kapal";

export default function AddKapal(){
    const router = useRouter();
    const [namaKapal, setNamaKapal] = useState('');
    const [mesin, setMesin] = useState('');
    const [lebar, setLebar] = useState('');
    const [panjang, setPanjang] = useState('');
    const [kilometer, setKilometer] = useState('');
    const [kedalaman, setKedalaman] = useState('');
    const [callsign, setCallsign] = useState('');
    const [GRT, setGRT] = useState('');
    const [DWT, setDWT] = useState('');
    const [status, setStatus] = useState({value: '1', label: 'Aktif'});
    const [jenisKapal, setJenisKapal] = useState([]);
    const [kapasitasAwak, setKapasitasAwak] = useState('');
    const [kapasitasPenumpang, setKapasitasPenumpang] = useState('');
    const [selectedJenisKapal, setSelectedJenisKapal] = useState({value: '', label: 'Pilih Data'});
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');

    useEffect(()=>{
        getJenisKapal();
    },[]);

    const back = () => {
        router.back();
    }

    const getJenisKapal = () => {
        setLoading(true);
        getJenisKapalAction(
            {
                limit: 50
            },
            (data)=>{
                let opt: any = data.data.map((item: IJenisKapal)=> {
                    return {
                        value: item.id,
                        label: item.nama_jenis_kapal
                    }
                });
                setJenisKapal(opt);
                setLoading(false);
            },
            (err)=>{
                setLoading(false);
                toast.error(toastErrorConfig);
            },
            ()=> router.replace('/login')
        );
    }

    const save = () => {
        setLoadingMessage('Menyimpan Data...')
        setLoading(true);
        const params = {
            nama_kapal: namaKapal,
            mesin: mesin,
            panjang: panjang,
            lebar: lebar,
            kilometer: kilometer,
            kedalaman: kedalaman,
            grt: GRT,
            dwt: DWT,
            callsign: callsign,
            status_kapal: status.value,
            id_jenis_kapal: selectedJenisKapal.value,
            kapasitas_awak: kapasitasAwak,
            kapasitas_penumpang: kapasitasPenumpang
        };
        createKapalAction(
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
             title="Tambah Kapal"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama Kapal"
                    placeholder="Masukkan nama kapal"
                    onChangeText={(e)=>setNamaKapal(e.target.value)}
                />
                <Input 
                    label="Mesin"
                    placeholder="Masukkan mesin kapal"
                    onChangeText={(e)=>setMesin(e.target.value)}
                />
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <Input 
                        label="Panjang Kapal (m)"
                        placeholder="Masukkan panjang kapal"
                        onChangeText={(e)=>setPanjang(e.target.value)}
                    />
                    <Input 
                        label="Lebar Kapal (m)"
                        placeholder="Masukkan lebar kapal"
                        onChangeText={(e)=>setLebar(e.target.value)}
                    />
                    <Input 
                        label="Kilometer Kapal (m)"
                        placeholder="Masukkan kilometer kapal"
                        onChangeText={(e)=>setKilometer(e.target.value)}
                    />
                    <Input 
                        label="Kedalaman Kapal (m)"
                        placeholder="Masukkan kedalaman kapal"
                        onChangeText={(e)=>setKedalaman(e.target.value)}
                    />
                    <Input 
                        label="GRT"
                        placeholder="Masukkan GRT"
                        onChangeText={(e)=>setGRT(e.target.value)}
                    />
                    <Input 
                        label="DWT"
                        placeholder="Masukkan DWT"
                        onChangeText={(e)=>setDWT(e.target.value)}
                    />
                    <Input 
                        label="Call Sign"
                        placeholder="Masukkan Call Sign"
                        onChangeText={(e)=>setCallsign(e.target.value)}
                    />
                    <SelectBox 
                        label="Status Kapal"
                        placeholder="Pilih status"
                        option={[
                            {value: '1', label: 'Aktif'},
                            {value: '0', label: 'Tidak Aktif'},
                        ]}
                        value={status}
                        onChange={setStatus}
                    />
                    <SelectBox 
                        label="Jenis Kapal"
                        placeholder="Masukkan data"
                        option={jenisKapal}
                        value={selectedJenisKapal}
                        onChange={setSelectedJenisKapal}
                    />
                    <Input 
                        label="Kapasitas Awak"
                        placeholder="Masukkan kapasitas awak kapal"
                        onChangeText={(e)=>setKapasitasAwak(e.target.value)}
                    />
                    <Input 
                        label="Kapasitas Penumpang"
                        placeholder="Masukkan kapasitas penumpang"
                        onChangeText={(e)=>setKapasitasPenumpang(e.target.value)}
                    />
                </div>
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