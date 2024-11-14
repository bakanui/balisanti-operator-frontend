'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { SelectBox } from "@/app/components/SelectBox";
import { convertLabelPriceToNumeberPrice, timeList, toastErrorConfig, toastSuccessConfig, jenisPenumpangSpawner, parseDateIncludeHours } from "@/app/utils/utility";
import { useRouter } from "next/navigation";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { TiketPriceInput } from "./components/TiketPriceInput";
import { useEffect, useState } from "react";
import { IOptions } from "@/app/types/auth";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { toast, ToastContainer } from "react-toastify";
import { getJenisPenumpangAction } from "../../penumpang/penumpang.service";
import { IJenisPenumpang } from "@/app/types/penumpang";
import { JENIS_JADWAL } from "@/app/constants/jenisJadwal";
import { getNahkodaAction } from "../../nahkoda/nahkoda.service";
import { INahkoda } from "@/app/types/nahkoda";
import { getKapalAction } from "../../kapal/kapal.service";
import { IKapal } from "@/app/types/kapal";
import { getRuteAction } from "../../rute/rute.service";
import { getDermagaAction } from "../../dermaga/dermaga.service";
import { IDermaga } from "@/app/types/dermaga";
import { IRute } from "@/app/types/rute";
import { createjadwalAction, createjadwalSiwalatriAction } from "../jadwal.service";
import { STATUS } from "@/app/constants/status";
import uniqid from 'uniqid';
import { BASE_ARMADA } from "@/app/utils/api";

export default function AddJadwal(){
    interface HargaTiketItem {
        id: number;
        id_jadwal: string;
        id_jenis_penumpang: number;
        harga: number;
        created_at: Date | string; // Use Date if you are working with Date objects, or string if JSON data
        updated_at: Date | string; // Same as above
        deleted_at: Date | null; // Nullable Date
        tipe_penumpang: string;
        jenis_penumpang: string;
    }    
    const router = useRouter();
    const [tiket, setTiket] = useState([
        {
            id: new Date().getTime(),
            penumpang: { value: '', label: 'Pilih Data', jenis: '', tipe: '' },
            tiket: '',
            js: '',
            jp: ''
        }
    ]);
    const [jenisPenumpang, setJenisPenumpang] = useState<IOptions[]>([]);
    const [kapal, setKapal] = useState<IOptions[]>([]);
    const [selectedKapal, setselectedKapal] = useState({ value: '', label: 'Pilih Data', armada: '' });
    const [nahkoda, setNahkoda] = useState<IOptions[]>([]);
    const [selectedNahkoda, setselectedNahkoda] = useState({ value: '', label: 'Pilih Data' });
    const [rute, setRute] = useState<IOptions[]>([]);
    const [selectedRute, setselectedRute] = useState({ value: '', label: 'Pilih Data' });
    const [dermaga, setDermaga] = useState<IOptions[]>([]);
    const [selectedDermaga, setselectedDermaga] = useState({ value: '', label: 'Pilih Data' });
    const [jenisJawal, setJenisJawal] = useState({ value: '', label: 'Pilih Data' });
    const [waktuKeberangkatan, setWaktuKeberangkatan] = useState({ value: '1', label: 'Pilih Data' });
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');
    const uid = uniqid();

    useEffect(()=> {
        setLoading(true);
        getKapalAction(
            {
                status: 1,
                limit: 100
            },
            (data) => {
                let tmp = data.data.map((item: IKapal)=> ({
                    value: item.id,
                    label: item.nama_kapal,
                    armada: item.id_armada
                }));
                setKapal(tmp);
                getNahkodaAction(
                    {
                        limit: 100
                    },
                    (data) => {
                        let tmp = data.data.map((item: INahkoda)=> ({
                            value: item.id,
                            label: item.nama_nahkoda
                        }));
                        setNahkoda(tmp);
                        getRuteAction(
                            {
                                limit: 100
                            },
                            (data) => {
                                let tmp = data.data.map((item: IRute)=> ({
                                    value: item.id,
                                    label: item.nama_rute
                                }));
                                setRute(tmp);
                                getDermagaAction(
                                    {
                                        limit: 100
                                    },
                                    (data) => {
                                        let tmp = data.data.map((item: IDermaga)=> ({
                                            value: item.id,
                                            label: item.nama_dermaga
                                        }));
                                        setDermaga(tmp);
                                        getJenisPenumpangAction(
                                            {
                                                limit: 100
                                            },
                                            (data) => {
                                                let tmp = data.data.map((item: IJenisPenumpang)=> ({
                                                    value: item.id,
                                                    label: `${item.tipe} - ${item.jenis}`,
                                                    tipe: item.tipe,
                                                    jenis: item.jenis
                                                }));
                                                setJenisPenumpang(tmp);
                                                setLoading(false);
                                            },
                                            (err)=> setLoading(false),
                                            () => router.replace('/login')
                                        );
                                    },
                                    (err)=> setLoading(false),
                                    () => router.replace('/login')
                                );
                            },
                            (err)=> setLoading(false),
                            () => router.replace('/login')
                        );
                    },
                    (err)=> setLoading(false),
                    () => router.replace('/login')
                );
            },
            (err)=> setLoading(false),
            () => router.replace('/login')
        );
    }, []);

    const save = () => {
        setLoadingMessage('Menyimpan Data...');
        setLoading(true);
    
        createjadwalAction(
            {
                id: uid,
                jenis_jadwal: jenisJawal.value,
                id_kapal: selectedKapal.value,
                id_nahkoda: selectedNahkoda.value,
                id_rute: selectedRute.value,
                id_armada: BASE_ARMADA,
                waktu_berangkat: waktuKeberangkatan.value,
                id_loket: selectedDermaga.value,
                status_jadwal: status.value,
                harga_tiket: tiket.map(item => ({
                    id_jenis_penumpang: item.penumpang.value,
                    tiket: convertLabelPriceToNumeberPrice(item.tiket),
                    js: convertLabelPriceToNumeberPrice(item.js),
                    jp: convertLabelPriceToNumeberPrice(item.jp)
                }))
            },
            (res) => {
                createjadwalSiwalatriAction(
                    {
                        id: uid,
                        jenis_jadwal: jenisJawal.value,
                        id_kapal: selectedKapal.value,
                        id_nahkoda: selectedNahkoda.value,
                        id_rute: selectedRute.value,
                        id_armada: BASE_ARMADA,
                        jadwal: waktuKeberangkatan.value,
                        id_loket: 88,
                        status: "Berlayar",
                        ekstra: 0,
                        harga_tiket: res.harga_tiket.map((item: HargaTiketItem) => ({
                            nama_tiket: item.tipe_penumpang,
                            id_jns_penum: jenisPenumpangSpawner(item.jenis_penumpang),
                            harga: item.harga,
                            id_siwalatri: item.id
                        })),
                        tanggal_berangkat: parseDateIncludeHours(new Date(), false),
                        tanggal_sampai: parseDateIncludeHours(new Date(), false)
                    },
                    () => {
                        toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                        setTimeout(() => {
                            back();
                        }, 500);
                        setLoading(false);
                    },
                    (err) => {
                        setLoading(false);
                        toast.error(err, toastErrorConfig);
                    }
                );
            },
            (err) => {
                setLoading(false);
                toast.error(err, toastErrorConfig);
            },
            () => router.replace('/login')
        );
    };
    

    const back = () => {
        router.back();
    }

    const addTiket = () => {
        setTiket([...tiket, {id: new Date().getTime() , penumpang: {value: '', label: 'Pilih Data', jenis: '', tipe: ''}, tiket: '0', js: '0', jp: '0' }]);
    }

    const deleteTiket = (index: number) => {
        if (index > -1) {
            let tmp = [...tiket];
            tmp.splice(index, 1);
            setTiket(tmp);
        }
    }

    const selectOption = (data: any, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].penumpang = data;
        setTiket(tmp);
    }

    const setHargaTiket = (value: string, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].tiket = value;
        setTiket(tmp);
    }

    const setJsTiket = (value: string, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].js = value;
        setTiket(tmp);
    }

    const setJpTiket = (value: string, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].jp = value;
        setTiket(tmp);
    }

    return(
        <BaseContainer>
            <CustomBreadcumb
             title="Tambah Jadwal Berlayar"
             onBack={back}
            />
            <BaseCard>
                <SelectBox 
                    label="Jenis Jadwal"
                    placeholder="Pilih data"
                    option={JENIS_JADWAL}
                    value={jenisJawal}
                    onChange={setJenisJawal}
                />
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <SelectBox 
                        label="Kapal"
                        placeholder="Pilih data"
                        option={kapal}
                        value={selectedKapal}
                        onChange={setselectedKapal}
                    />
                    <SelectBox 
                        label="Nahkoda"
                        placeholder="Pilih data"
                        option={nahkoda}
                        value={selectedNahkoda}
                        onChange={setselectedNahkoda}
                    />
                    <SelectBox 
                        label="Rute Perjalanan"
                        placeholder="Pilih data"
                        option={rute}
                        value={selectedRute}
                        onChange={setselectedRute}
                    />
                    <SelectBox 
                        label="Waktu Keberangkatan"
                        placeholder="Pilih data"
                        option={timeList}
                        value={waktuKeberangkatan}
                        onChange={setWaktuKeberangkatan}
                    />
                </div>
                <SelectBox 
                    label="Loket"
                    placeholder="Pilih data"
                    option={dermaga}
                    value={selectedDermaga}
                    onChange={setselectedDermaga}
                />
                <SelectBox
                    label="Status"
                    placeholder="Pilih data"
                    option={STATUS}
                    value={status}
                    onChange={setStatus}
                />
            </BaseCard>
            <div className="mb-4"/>
            <CustomBreadcumb
                title="Harga Tiket"
                noRoute={true}
             />
            <BaseCard>
                {tiket.map((item, index)=>{
                    return(
                        <TiketPriceInput 
                            key={item.id}
                            onDelete={()=>deleteTiket(index)}
                            deleteAble={tiket.length > 1}
                            value={item.penumpang}
                            options={jenisPenumpang}
                            onOptionChange={(e)=> selectOption(e, index)}
                            priceValue={item.tiket}
                            priceChange={(val)=>setHargaTiket(val, index)}
                            jsValue={item.js}
                            jsChange={(val)=>setJsTiket(val, index)}
                            jpValue={item.jp}
                            jpChange={(val)=>setJpTiket(val, index)}
                        />
                    );
                })}
                <div className="w-[180px]">
                    <Button 
                        label="Tambah Harga Tiket"
                        icon={faPlus}
                        onClick={addTiket}
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