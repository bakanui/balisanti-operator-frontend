'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { SelectBox } from "@/app/components/SelectBox";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { editKapalAction, getDetailKapalAction } from "../kapal.service";
import { ToastContainer, toast } from 'react-toastify';
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { getJenisKapalAction } from "../../jenis-kapal/jenis-kapal.service";
import { IJenisKapal } from "@/app/types/kapal";

export default function EditKapal(){
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [namaKapal, setNamaKapal] = useState('');
    const [mesin, setMesin] = useState('');
    const [lebar, setLebar] = useState<any>(0);
    const [panjang, setPanjang] = useState<any>(0);
    const [kilometer, setKilometer] = useState<any>(0);
    const [kedalaman, setKedalaman] = useState<any>(0);
    const [GRT, setGRT] = useState('');
    const [DWT, setDWT] = useState('');
    const [callsign, setCallsign] = useState('');
    const [status, setStatus] = useState({value: '1', label: 'Aktif'});
    const [jenisKapal, setJenisKapal] = useState([]);
    const [kapasitasAwak, setKapasitasAwak] = useState<any>(0);
    const [kapasitasPenumpang, setKapasitasPenumpang] = useState<any>(0);
    const [selectedJenisKapal, setSelectedJenisKapal] = useState({value: '', label: 'Pilih Data'});
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getJenisKapal();
    },[]);

    const getDetail = () => {
        setLoading(true);
        getDetailKapalAction(
            queryParams.get('id'),
            (data)=>{
                setNamaKapal(data.nama_kapal);
                setMesin(data.mesin);
                setLebar(data.lebar);
                setPanjang(data.panjang);
                setKilometer(data.kilometer);
                setKedalaman(data.kedalaman);
                setGRT(data.grt);
                setDWT(data.dwt);
                setCallsign(data.callsign);
                setStatus({ value: `${data.status_kapal}`, label: data.status_kapal == 1 ? 'Aktif' : 'Tidak Aktif' });
                setSelectedJenisKapal({value: `${data.id_jenis_kapal}`, label: data.nama_jenis_kapal});
                setKapasitasAwak(data.kapasitas_awak);
                setKapasitasPenumpang(data.kapasitas_penumpang);
                setLoading(false);
                console.log('val = ', {value: `${data.id_jenis_kapal}`, label: data.nama_jenis_kapal});
                
            },
            ()=>{
                setLoading(false);
            }
        );
    }

    const getJenisKapal = () => {
        getJenisKapalAction(
            {
                limit: 50
            },
            (data)=>{
                let opt = data.data.map((item: IJenisKapal)=> {
                    return {
                        value: item.id,
                        label: item.nama_jenis_kapal
                    }
                });
                setJenisKapal(opt);
                getDetail();        
            },
            ()=>{}
        );
    }

    const back = () => {
        router.back();
    }

    const save = () => {
        setLoading(true);
        const params = {
            id: queryParams.get('id'),
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
        editKapalAction(
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
             title="Edit Kapal"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama Kapal"
                    placeholder="Masukkan nama kapal"
                    onChangeText={(e)=>setNamaKapal(e.target.value)}
                    value={namaKapal}
                />
                <Input 
                    label="Mesin"
                    placeholder="Masukkan mesin kapal"
                    onChangeText={(e)=>setMesin(e.target.value)}
                    value={mesin}
                />
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <Input 
                        label="Panjang Kapal (m)"
                        placeholder="Masukkan panjang kapal"
                        onChangeText={(e)=>setPanjang(e.target.value)}
                        value={panjang}
                    />
                    <Input 
                        label="Lebar Kapal (m)"
                        placeholder="Masukkan lebar kapal"
                        onChangeText={(e)=>setLebar(e.target.value)}
                        value={lebar}
                    />
                    <Input 
                        label="Kilometer Kapal (m)"
                        placeholder="Masukkan kilometer kapal"
                        onChangeText={(e)=>setKilometer(e.target.value)}
                        value={kilometer}
                    />
                    <Input 
                        label="Kedalaman Kapal (m)"
                        placeholder="Masukkan kedalaman kapal"
                        onChangeText={(e)=>setKedalaman(e.target.value)}
                        value={kedalaman}
                    />
                    <Input 
                        label="GRT"
                        placeholder="Masukkan GRT"
                        onChangeText={(e)=>setGRT(e.target.value)}
                        value={GRT}
                    />
                    <Input 
                        label="DWT"
                        placeholder="Masukkan DWT"
                        onChangeText={(e)=>setDWT(e.target.value)}
                        value={DWT}
                    />
                    <Input 
                        label="Call Sign"
                        placeholder="Masukkan Call Sign"
                        onChangeText={(e)=>setCallsign(e.target.value)}
                        value={callsign}
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
                        value={kapasitasAwak}
                    />
                    <Input 
                        label="Kapasitas Penumpang"
                        placeholder="Masukkan kapasitas penumpang"
                        onChangeText={(e)=>setKapasitasPenumpang(e.target.value)}
                        value={kapasitasPenumpang}
                    />
                </div>
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