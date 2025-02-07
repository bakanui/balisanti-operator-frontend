'use client'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { SelectBox } from "../components/SelectBox";
import { Input } from "@/app/components/Input";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { TiketPriceInput } from "@/app/master-data/jadwal/tambah/components/TiketPriceInput";
import { ToastContainer, toast } from 'react-toastify';
import { convertLabelPriceToNumeberPrice, jenisPenumpangSpawner, parseDateIncludeHours, parseDateToBackendFormat, parseDateToShortFormat, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IKapal } from "@/app/types/kapal";
import { INahkoda } from "@/app/types/nahkoda";
import { IOptions } from "@/app/types/auth";
import { IJenisPenumpang } from "@/app/types/penumpang";
import { IJenisKapal } from "@/app/types/kapal";
import { getKapalAction, createKapalAction } from "@/app/master-data/kapal/kapal.service";
import { getNahkodaAction } from "@/app/master-data/nahkoda/nahkoda.service";
import { getJenisPenumpangAction } from "@/app/master-data/penumpang/penumpang.service";
import { getJenisKapalAction } from "@/app/master-data/jenis-kapal/jenis-kapal.service";
import { SandarPriceInput } from "./components/SandarPriceInput";
import { createKapalSiwalatriAction } from "@/app/master-data/kapal/kapal.service";
import { createjadwalAction, createjadwalSiwalatriAction } from "../master-data/jadwal/jadwal.service";
import uniqid from 'uniqid';
import { createSandarAction, handleDownloadBASandar } from "./sandar.service";
import fileDownload from "js-file-download";

export default function AddPenjualanTiket() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [kapal, setKapal] = useState<IOptions[]>([]);
    const [nahkoda, setNahkoda] = useState<IOptions[]>([]);
    const [jenisPenumpang, setJenisPenumpang] = useState<IOptions[]>([]);
    const [selectedKapal, setSelectedKapal] = useState({value: '', label: ''});
    const [namaKapal, setNamaKapal] = useState('');
    const [mesin, setMesin] = useState('');
    const [lebar, setLebar] = useState('');
    const [panjang, setPanjang] = useState('');
    const [kilometer, setKilometer] = useState('');
    const [kedalaman, setKedalaman] = useState('');
    const [callsign, setCallsign] = useState('');
    const [armada, setArmada] = useState('');
    const [GRT, setGRT] = useState('');
    const [DWT, setDWT] = useState('');
    const [jenisKapal, setJenisKapal] = useState([]);
    const [kapasitasAwak, setKapasitasAwak] = useState('');
    const [kapasitasPenumpang, setKapasitasPenumpang] = useState('');
    const [selectedJenisKapal, setSelectedJenisKapal] = useState({value: '', label: 'Pilih Data'});
    const [selectedNahkoda, setselectedNahkoda] = useState({ value: '', label: 'Pilih Data' });
    const [tiket, setTiket] = useState([
        {
            id: new Date().getTime(),
            penumpang: { value: '', label: 'Pilih Data', jenis: '', tipe: '' },
            tiket: '',
            jr: '',
            jpk: '',
            jpb: '',
            pass: '',
            dermaga: '',
            jumlahPenumpang: '',
            jumlah: 0
        }
    ]);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');
    const [download, setDownload] = useState(false);
    const [idDownload, setIdDownload] = useState('');
    interface HargaTiketItem {
        id: number;
        id_jadwal: string;
        id_jenis_penumpang: number;
        harga: number;
        penumpang: string
        created_at: Date | string; // Use Date if you are working with Date objects, or string if JSON data
        updated_at: Date | string; // Same as above
        deleted_at: Date | null; // Nullable Date
        tipe_penumpang: string;
        jenis_penumpang: string;
    }    
    interface LayananSandar {
        penumpang: any;
        jenis_penumpang: any;
        id: number;
        id_jadwal: string;
        id_jadwaljenispenumpang: number;
        jumlah: number;
        created_at: Date | string; // Use Date if you are working with Date objects, or string if JSON data
        updated_at: Date | string; // Same as above
        deleted_at: Date | null; // Nullable Date
    }
    const uid = uniqid();

    useEffect(() => {
        document.title = "Layanan Sandar | SIPELARANG";
    }, [])

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
                    armada: item.id_armada,
                    mesin: item.mesin,
                    panjang: item.panjang,
                    lebar: item.lebar,
                    kilometer: item.kilometer,
                    kedalaman: item.kedalaman,
                    grt: item.grt,
                    dwt: item.dwt,
                    callsign: item.callsign,
                    status_kapal: item.status_kapal,
                    id_jenis_kapal: item.id_jenis_kapal,
                    nama_jenis_kapal: item.nama_jenis_kapal,
                    kapasitas_awak: item.kapasitas_awak,
                    kapasitas_penumpang: item.kapasitas_penumpang,
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

    function handleSelectedKapal(selectedOption: { value: string, label: string }) {
        if(selectedOption.value !== 'new') {
            console.log('Selected Kapal:', selectedOption);
            const selectedKapalData = kapal.find(k => k.value === selectedOption.value);
            console.log('Selected Kapal Data:', selectedKapalData);
    
            if (selectedKapalData) {
                setSelectedKapal(selectedOption);
                setNamaKapal(selectedKapalData.label);
                setMesin(selectedKapalData.mesin);
                setLebar(selectedKapalData.lebar);
                setPanjang(selectedKapalData.panjang);
                setKilometer(selectedKapalData.kilometer);
                setKedalaman(selectedKapalData.kedalaman);
                setCallsign(selectedKapalData.callsign);
                setArmada(selectedKapalData.armada);
                setGRT(Number(selectedKapalData.grt));
                setDWT(Number(selectedKapalData.dwt));
                setKapasitasAwak(Number(selectedKapalData.kapasitas_awak));
                setKapasitasPenumpang(Number(selectedKapalData.kapasitas_penumpang));
                setSelectedJenisKapal([{value: selectedKapalData.id_jenis_kapal, label: selectedKapalData.nama_jenis_kapal}]);
            }
        } else {
            setSelectedKapal(selectedOption);
            setNamaKapal("");
            setMesin("");
            setLebar("");
            setPanjang("");
            setKilometer("");
            setKedalaman("");
            setCallsign("");
            setGRT("");
            setDWT("");
            setKapasitasAwak("");
            setArmada("6c722eyfmtlh0");
            setKapasitasPenumpang("");
            setSelectedJenisKapal([{value: '', label: 'Pilih Data'}]);
        }
        
    }

    const save = () => {
        setLoadingMessage('Menyimpan Data...')
        setLoading(true);
        if (selectedKapal.value !== 'new') {
            createjadwalAction(
                {
                    id: uid,
                    jenis_jadwal: "Layanan Sandar",
                    id_kapal: selectedKapal.value,
                    id_nahkoda: selectedNahkoda.value,
                    id_rute: 7,
                    id_armada: armada,
                    waktu_berangkat: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                    id_loket: 88,
                    status_jadwal: 1,
                    harga_tiket: tiket.map(item => ({
                        id_jenis_penumpang: Number(item.penumpang.value),
                        tiket: convertLabelPriceToNumeberPrice(item.tiket),
                        jr: convertLabelPriceToNumeberPrice(item.jr),
                        jpk: convertLabelPriceToNumeberPrice(item.jpk),
                        jpb: convertLabelPriceToNumeberPrice(item.jpb),
                        pass: convertLabelPriceToNumeberPrice(item.pass),
                        dermaga: convertLabelPriceToNumeberPrice(item.dermaga),
                        penumpang: Number(item.jumlahPenumpang)
                    }))
                },
                (res) => {
                    createjadwalSiwalatriAction(
                        {
                            id: uid,
                            jenis_jadwal: "Layanan Sandar",
                            id_kapal: selectedKapal.value,
                            id_nahkoda: selectedNahkoda.value,
                            id_rute: 1,
                            id_armada: armada,
                            jadwal: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }),
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
                            // toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                            // setLoading(false);
                            // router.replace('/laporan/pembayaran');
                            createSandarAction(
                                {
                                    data: res.harga_tiket.map((item: HargaTiketItem) => ({
                                        id_jadwal: uid,
                                        id_jadwaljenispenumpang: item.id,
                                        jumlah: item.penumpang,
                                    })),
                                },
                                () => {
                                    toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                                    setLoading(false);
                                    setDownload(true);
                                    setIdDownload(uid);
                                    // router.push('/layanan-sandar/detail-invoice?id='+uid);
                                },
                                (err) => {
                                    setLoading(false);
                                    toast.error(err, toastErrorConfig);
                                },
                            );
                        },
                        (err) => {
                            setLoading(false);
                            toast.error(err, toastErrorConfig);
                        },
                    );
                },
                (err) => {
                    setLoading(false);
                    toast.error(err, toastErrorConfig);
                },
                () => router.replace('/login')
            );
        } else {
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
                status_kapal: 1,
                id_jenis_kapal: selectedJenisKapal.value,
                kapasitas_awak: kapasitasAwak,
                kapasitas_penumpang: kapasitasPenumpang
            };
            createKapalAction(
                params,
                (data)=>{
                    const params_siwalatri = {
                        id: data.id,
                        nama_kapal: namaKapal,
                        mesin: mesin,
                        panjang: panjang,
                        lebar: lebar,
                        dimension: kedalaman,
                        kapasitas_penumpang: kapasitasPenumpang,
                        kapasitas_crew: kapasitasAwak,
                        id_armada: armada,
                        id_jenis: 4,
                        id_status: 1,
                        kilometer: kilometer,
                        callsign: callsign,
                        grt: GRT,
                        dwt: DWT,
                    };
                    createKapalSiwalatriAction(
                        params_siwalatri,
                        ()=>{
                            createjadwalAction(
                                {
                                    id: uid,
                                    jenis_jadwal: "Layanan Sandar",
                                    id_kapal: data.id,
                                    id_nahkoda: selectedNahkoda.value,
                                    id_rute: 7,
                                    id_armada: armada,
                                    waktu_berangkat: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                                    id_loket: 88,
                                    status_jadwal: 1,
                                    harga_tiket: tiket.map(item => ({
                                        id_jenis_penumpang: item.penumpang.value,
                                        tiket: convertLabelPriceToNumeberPrice(item.tiket),
                                        jr: convertLabelPriceToNumeberPrice(item.jr),
                                        jpk: convertLabelPriceToNumeberPrice(item.jpk),
                                        jpb: convertLabelPriceToNumeberPrice(item.jpb),
                                        pass: convertLabelPriceToNumeberPrice(item.pass),
                                        dermaga: convertLabelPriceToNumeberPrice(item.dermaga),
                                        penumpang: Number(item.jumlahPenumpang)
                                    }))
                                },
                                (res) => {
                                    createjadwalSiwalatriAction(
                                        {
                                            id: uid,
                                            jenis_jadwal: "Layanan Sandar",
                                            id_kapal: data.id,
                                            id_nahkoda: selectedNahkoda.value,
                                            id_rute: 1,
                                            id_armada: armada,
                                            jadwal: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' }),
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
                                            // toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                                            // setLoading(false);
                                            // router.replace('/laporan/pembayaran');
                                            createSandarAction(
                                                {
                                                    data: res.harga_tiket.map((item: HargaTiketItem) => ({
                                                        id_jadwal: uid,
                                                        id_jadwaljenispenumpang: item.jenis_penumpang,
                                                        jumlah: item.penumpang,
                                                    })),
                                                },
                                                () => {
                                                    toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                                                    setLoading(false);
                                                    setDownload(true);
                                                    setIdDownload(uid);
                                                    // router.push('/layanan-sandar/detail-invoice?id='+uid);
                                                },
                                                (err) => {
                                                    setLoading(false);
                                                    toast.error(err, toastErrorConfig);
                                                },
                                            );
                                        },
                                        (err) => {
                                            setLoading(false);
                                            toast.error(err, toastErrorConfig);
                                        },
                                    );
                                },
                                (err) => {
                                    setLoading(false);
                                    toast.error(err, toastErrorConfig);
                                },
                                () => router.replace('/login')
                            );
                        },
                        (err)=>{
                            setLoading(false);
                            toast.error(err, toastErrorConfig);
                        }
                    );
                },
                (err)=>{
                    setLoading(false);
                    toast.error(err, toastErrorConfig);
                }
            );
        }
    }

    const addTiket = () => {
        setTiket([...tiket, {id: new Date().getTime() , penumpang: {value: '', label: 'Pilih Data', jenis: '', tipe: ''}, tiket: '0', jr: '0', jpk: '0', jpb: '0', pass: '0', dermaga: '0', jumlahPenumpang: '', jumlah: 0 }]);
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

    const setPenumpang = (value: string, index: number) => {
        let tmp = JSON.parse(JSON.stringify(tiket));
        tmp[index].jumlahPenumpang = value;
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

    const handleDownloadLapBA = () => {
        setLoading(true);
        let fileName = 'LaporanBeritaAcara_' + parseDateToShortFormat(new Date()) + '.pdf';
        handleDownloadBASandar(
          {
            id_jadwal: idDownload,
            tanggal: parseDateToBackendFormat(new Date()),
            tanggal_akhir: parseDateToBackendFormat(new Date())
          },
          (data)=>{
              fileDownload(data, fileName);
              setLoading(false);
          },
          ()=>{
              setLoading(false);
          }
      );
      }
    

    return(
        <BaseContainer>
            <CustomBreadcumb title="Layanan Sandar" noRoute/>
            <BaseCard>
                <div className="sm:grid gap-x-12">
                    <SelectBox
                        label="Kapal"
                        placeholder="Pilih Kapal"
                        option={[
                            {value: 'new', label: 'Buat Kapal Baru'},
                            ...kapal
                        ]}
                        onChange={handleSelectedKapal}
                    />
                </div>
                {/* <Button 
                    label="Cari Tiket"
                    onClick={cariData}
                /> */}
            </BaseCard>
            <div className="mb-4"/>
            {selectedKapal.value !== "" ? <>
            <CustomBreadcumb title="Info Kapal" noRoute/>
            <BaseCard>
                <Input 
                    label="Nama Kapal"
                    placeholder="Masukkan nama kapal"
                    value={namaKapal}
                    onChangeText={(e)=>setNamaKapal(e.target.value)}
                />
                <Input 
                    label="Mesin"
                    placeholder="Masukkan mesin kapal"
                    value={mesin}
                    onChangeText={(e)=>setMesin(e.target.value)}
                />
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <Input 
                        label="Panjang Kapal (m)"
                        placeholder="Masukkan panjang kapal"
                        value={panjang}
                        onChangeText={(e)=>setPanjang(e.target.value)}
                    />
                    <Input 
                        label="Lebar Kapal (m)"
                        placeholder="Masukkan lebar kapal"
                        value={lebar}
                        onChangeText={(e)=>setLebar(e.target.value)}
                    />
                    <Input 
                        label="Kilometer Kapal (m)"
                        placeholder="Masukkan kilometer kapal"
                        value={kilometer}
                        onChangeText={(e)=>setKilometer(e.target.value)}
                    />
                    <Input 
                        label="Kedalaman Kapal (m)"
                        placeholder="Masukkan kedalaman kapal"
                        value={kedalaman}
                        onChangeText={(e)=>setKedalaman(e.target.value)}
                    />
                    <Input 
                        label="GRT"
                        placeholder="Masukkan GRT"
                        value={GRT}
                        onChangeText={(e)=>setGRT(e.target.value)}
                    />
                    <Input 
                        label="DWT"
                        placeholder="Masukkan DWT"
                        value={DWT}
                        onChangeText={(e)=>setDWT(e.target.value)}
                    />
                    <Input 
                        label="Call Sign"
                        placeholder="Masukkan Call Sign"
                        value={callsign}
                        onChangeText={(e)=>setCallsign(e.target.value)}
                    />
                    <SelectBox 
                        label="Nahkoda"
                        placeholder="Pilih data"
                        option={nahkoda}
                        value={selectedNahkoda}
                        onChange={setselectedNahkoda}
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
                        value={kapasitasAwak}
                        onChangeText={(e)=>setKapasitasAwak(e.target.value)}
                    />
                    <Input 
                        label="Kapasitas Penumpang"
                        placeholder="Masukkan kapasitas penumpang"
                        value={kapasitasPenumpang}
                        onChangeText={(e)=>setKapasitasPenumpang(e.target.value)}
                    />
                </div>
            </BaseCard>
            <div className="mb-4"/>
            <CustomBreadcumb
                title="Harga Tiket"
                noRoute={true}
             />
            <BaseCard>
                {tiket.map((item, index)=>{
                    return(
                        <SandarPriceInput 
                            key={item.id}
                            onDelete={()=>deleteTiket(index)}
                            deleteAble={tiket.length > 1}
                            value={item.penumpang}
                            options={jenisPenumpang}
                            onOptionChange={(e)=> selectOption(e, index)}
                            penumpangValue={item.jumlahPenumpang}
                            penumpangChange={(val)=>setPenumpang(val, index)}
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
            {download ? <Button 
                  label='Download Laporan Berita Acara'
                  onClick={handleDownloadLapBA}
                /> : ""}
            <ButtonGroup
                onConfirm={save}
            /> </>: ''}
            <LoadingOverlay
                loading={loading}
                title={loadingMessage}
            />
            <ToastContainer />
        </BaseContainer>
    );
}
