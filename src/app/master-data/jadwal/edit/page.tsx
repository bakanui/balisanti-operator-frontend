'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { SelectBox } from "@/app/components/SelectBox";
import { convertLabelPriceToNumeberPrice, timeList, toastErrorConfig, toastSuccessConfig, jenisPenumpangSpawner } from "@/app/utils/utility";
import { useRouter, useSearchParams } from "next/navigation";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { TiketPriceInput } from "./../tambah/components/TiketPriceInput";
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
import { editjadwalAction, editjadwalSiwalatriAction, getDetailjadwalAction, setJadwalImageAction } from "../jadwal.service";
import { STATUS } from "@/app/constants/status";
import { IJadwal } from "@/app/types/jadwal";
import { FilePicker } from "@/app/components/FilePicker";
import { NoImageIcon } from "@/assets/svg/NoImageIcon";

export default function EditJadwal(){
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
    const queryParams: any = useSearchParams();
    const [tiket, setTiket] = useState([
        {
            id: new Date().getTime(),
            penumpang: { value: '', label: 'Pilih Data' },
            tiket: '',
            jr: '',
            jpk: '',
            jpb: '',
            pass: '',
            dermaga: ''
        }
    ]);
    const [jenisPenumpang, setJenisPenumpang] = useState<IOptions[]>([]);
    const [kapal, setKapal] = useState<IOptions[]>([]);
    const [selectedKapal, setselectedKapal] = useState({ value: '', label: 'Pilih Data' });
    const [nahkoda, setNahkoda] = useState<IOptions[]>([]);
    const [selectedNahkoda, setselectedNahkoda] = useState({ value: '', label: 'Pilih Data' });
    const [rute, setRute] = useState<IOptions[]>([]);
    const [selectedRute, setselectedRute] = useState({ value: '', label: 'Pilih Data' });
    const [dermaga, setDermaga] = useState<IOptions[]>([]);
    const [selectedDermaga, setselectedDermaga] = useState({ value: '', label: 'Pilih Data' });
    const [jenisJawal, setJenisJawal] = useState({ value: '', label: 'Pilih Data' });
    const [waktuKeberangkatan, setWaktuKeberangkatan] = useState({ value: '1', label: 'Pilih Data' });
    const [status, setStatus] = useState({ value: '1', label: 'Aktif' });
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState('');

    useEffect(()=> {
        setLoading(true);
        getKapalAction(
            {
                limit: 100
            },
            (data) => {
                let tmp = data.data.map((item: IKapal)=> ({
                    value: item.id,
                    label: item.nama_kapal
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
                                                    label: `${item.tipe} - ${item.jenis}`
                                                }));
                                                setJenisPenumpang(tmp);
                                                getDetailjadwalAction(
                                                    queryParams.get('id'),
                                                    (data) => {
                                                        setData(data);
                                                        document.title = "Edit " + data.waktu_berangkat +" | SIPELARANG";
                                                        if(data.image){
                                                            setFile(data.image);
                                                        }
                                                        setLoading(false);
                                                    },
                                                    (err) => {
                                                        setLoading(false);
                                                        toast.error(err, toastErrorConfig);
                                                    },
                                                    ()=> router.replace('./login')
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
            },
            (err)=> setLoading(false),
            () => router.replace('/login')
        );
    }, []);

    const setData = (data: IJadwal) => {
        let tmpTiket = data.harga_tiket.map((item)=> ({
            id: item.id,
            penumpang: {
                value: `${item.id_jenis_penumpang}`,
                label: `${item.tipe_penumpang} - ${item.jenis_penumpang}`
            },
            tiket: `${item.tiket}`,
            jr: `${item.jr}`,
            jpb: `${item.jpb}`,
            jpk: `${item.jpk}`,
            pass: `${item.pass}`,
            dermaga: `${item.dermaga}`,
        }));
        setJenisJawal({value: `${data.jenis_jadwal}`, label: data.jenis_jadwal});
        setselectedKapal({value: `${data.id_kapal}`, label: data.nama_kapal});
        setselectedNahkoda({value: `${data.id_nahkoda}`, label: data.nama_nahkoda});
        setselectedRute({value: `${data.rute.id}`, label: data.rute.nama_rute});
        setselectedDermaga({value: `${data.rute.id_dermaga_awal}`, label: data.rute.nama_dermaga_awal});
        setWaktuKeberangkatan({value: `${data.waktu_berangkat}`, label: data.waktu_berangkat});
        setTiket(tmpTiket);
    }
    const save = () => {
        setLoading(true);
        setLoadingMessage('Menyimpan Data...');
        editjadwalAction(
            {
                id: queryParams.get('id'),
                jenis_jadwal: jenisJawal.value,
                id_kapal: selectedKapal.value,
                id_nahkoda: selectedNahkoda.value,
                id_rute: selectedRute.value,
                waktu_berangkat: waktuKeberangkatan.value,
                id_loket: selectedDermaga.value,
                status_jadwal: status.value,
                harga_tiket: tiket.map((item => ({
                    id_jenis_penumpang: item.penumpang.value,
                    tiket: convertLabelPriceToNumeberPrice(item.tiket),
                    jr: convertLabelPriceToNumeberPrice(item.jr),
                    jpk: convertLabelPriceToNumeberPrice(item.jpk),
                    jpb: convertLabelPriceToNumeberPrice(item.jpb),
                    pass: convertLabelPriceToNumeberPrice(item.pass),
                    dermaga: convertLabelPriceToNumeberPrice(item.dermaga)
                })))
            },
            (res)=>{
                editjadwalSiwalatriAction(
                    queryParams.get('id'),
                    {
                        jadwal: waktuKeberangkatan.value + ":00",
                        status: "Berlayar",
                        jenis_jadwal: jenisJawal.value,
                        id_nahkoda: selectedNahkoda.value,
                        id_kapal: selectedKapal.value,
                        id_rute: selectedRute.value,
                        ekstra: 0,
                        id_loket: 88,
                        status_kirim_mitra: 0,
                        harga_tiket: res.harga_tiket.map((item: HargaTiketItem) => ({
                            nama_tiket: item.tipe_penumpang,
                            id_jns_penum: jenisPenumpangSpawner(item.jenis_penumpang),
                            harga: item.harga,
                            id_siwalatri: item.id
                        })),
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
                    () => router.replace('/login')
                );
            },
            (err)=>{
                setLoading(false);
                toast.error(err, toastErrorConfig);
            },
            () => router.replace('/login')
        );
    }

    const back = () => {
        router.back();
    }

    const addTiket = () => {
        setTiket([...tiket, {id: new Date().getTime() , penumpang: {value: '', label: 'Pilih Data'}, tiket: '0', jr: '0', jpk: '0', jpb: '0', pass: '0', dermaga: '0' }]);
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

    const setJrTiket = (value: string, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].jr = value;
        setTiket(tmp);
    }

    const setJpkTiket = (value: string, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].jpk = value;
        setTiket(tmp);
    }

    const setJpbTiket = (value: string, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].jpb = value;
        setTiket(tmp);
    }

    const setPassTiket = (value: string, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].pass = value;
        setTiket(tmp);
    }

    const setDermagaTiket = (value: string, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].dermaga = value;
        setTiket(tmp);
    }


  const pickFile = (event: any) => {
    if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            setLoadingMessage('Mengunggah Gambar...')
            setLoading(true);
            setJadwalImageAction(
                {
                    id: queryParams.get('id'),
                    image: i
                },
                (data)=> {
                    toast.success(data.message);
                    getDetailjadwalAction(
                        queryParams.get('id'),
                        (data) => {
                            setData(data);
                            if(data.image){
                                setFile(data.image);
                            }
                            setLoading(false);
                        },
                        (err) => {
                            setLoading(false);
                            toast.error(err, toastErrorConfig);
                        },
                        ()=> router.replace('./login')
                    );
                },
                ()=> {
                    setLoading(false);
                }
            );
        }
    }

    return(
        <BaseContainer>
            <CustomBreadcumb
             title="Edit Jadwal Berlayar"
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
                {/* <div className="flex items-center mb-2">
                    <div className="font-robotomedium text-sm">Gambar Tiket</div>
                </div>
                <div className="w-full h-[200px] border-2 border-dashed rounded-md flex flex-col items-center justify-center">
                    {file ? 
                        <img src={`${file}`} className='h-[190px] object-contain rounded-md'/>
                        : 
                        <>
                            <NoImageIcon size="64px"/>
                            <div className="text-slate-500">Belum ada gambar untuk tiket ini</div>
                        </>
                    }
                </div>
                <FilePicker
                    label=""
                    onClick={pickFile}
                    type={'image/*'}
                /> */}
                <div className="mt-4"/>
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
                            jrValue={item.jr}
                            jrChange={(val)=>setJrTiket(val, index)}
                            jpkValue={item.jpk}
                            jpkChange={(val)=>setJpkTiket(val, index)}
                            jpbValue={item.jpb}
                            jpbChange={(val)=>setJpbTiket(val, index)}
                            passValue={item.pass}
                            passChange={(val)=>setPassTiket(val, index)}
                            dermagaValue={item.dermaga}
                            dermagaChange={(val)=>setDermagaTiket(val, index)}
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