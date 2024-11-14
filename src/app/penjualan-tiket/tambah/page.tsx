'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { SelectBox } from "@/app/components/SelectBox";
import { convertLabelToPrice, parseDateToBackendFormat, timeList, toastErrorConfig, toastSuccessConfig, convertLabelPriceToNumeberPrice } from "@/app/utils/utility";
import { useRouter, useSearchParams } from "next/navigation";
import { TiketCard } from "../components/TiketCard";
import { Input, InputBtn } from "@/app/components/Input";
import { DatePicker } from "@/app/components/DatePicker";
import { Radio } from "@/app/components/Radio";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { NumberSeparator } from "../components/NumberSeparator";
import { Button } from "@/app/components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { CheckBox } from "@/app/components/CheckBox";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { toast, ToastContainer } from "react-toastify";
import { createPenjualanAction, createPenjualanSiwalatriAction, getJenisPenumpangByIdAction } from "../penjualanTiket.service";
import { IOptions, IUsers } from "@/app/types/auth";
import { getAgenAction } from "@/app/master-data/agen/agen.service";
import { IAgen } from "@/app/types/agen";
import { IPenjualanTiket, IPenumpangInfo } from "@/app/types/jadwal";
import { getStorageValue } from "@/app/utils/localstoreage";
import { KEWARNEGARAAN } from "@/app/constants/kewarnegaraan";
import { JENIS_KELAMIN } from "@/app/constants/jenisKelamin";
import { JENIS_PEMBAYARAN } from "@/app/constants/jenisPembayaran";
import { IHargaService } from "@/app/types/hargaService";
import { getHargaServiceAction } from "@/app/master-data/barang/hargaService.service";
import { getDetailRuteAction } from "@/app/master-data/rute/rute.service";
import { getDetailPenumpangByPhone } from "@/app/master-data/penumpang/penumpang.service";
import { IRute } from "@/app/types/rute";
import { PricingTable } from "../components/PricingTable";
import { CustomModal } from "@/app/components/CustomModal";
import { SearchTiketModal } from "../components/SearchTiketModal";
import { PaketModal } from "../components/PaketModal";
import { Alert } from "@/app/components/Alert";
import { PriceInput } from "@/app/components/PriceInput"
import { createPembayaranAction } from "@/app/pembayaran-agen/pembayaran.service";
import seat from './../../../assets/seat.png';
import { InputQty } from "@/app/components/InputQty";
import { M_PLUS_1 } from "@next/font/google";

export default function AddPenjualanTiket() {
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [jenisPenumpang, setJenisPenumpang] = useState<IOptions[]>([]);
    const [qty, setQty] = useState(1);
    const [agen, setAgen] = useState<IOptions[]>([]);
    const [selectedAgen, setSelectedAgen] = useState({ value: '61', label: 'Gangga Express' });
    const [agenOrigin, setAgenOrigin] = useState<IAgen[]>([]);
    const [agenHolder, setAgenHolder] = useState<IAgen | null>(null);
    const [tiket, setTiket] = useState<IPenjualanTiket | null>(null);
    const [tanggalKeberangkatan, setTanggalKeberangkatan] = useState(new Date());
    const [tanggalBalik, setTanggalBalik2] = useState(new Date());
    const [jenisPerjalanan, setjenisPerjalanan] = useState<'sekali_jalan' | 'pulang_pergi'>('sekali_jalan');
    const [ppInfo, setPpInfo] = useState({
        id_tiket: '',
        tanggal_balik: new Date(),
        jamBalik: '',
        demagaAsal: { value: '', label: 'Pilih Data' },
        demagaTujuan: { value: '', label: 'Pilih Data' }
    });
    const [rombongan, setRombongan] = useState([
        {
            id: new Date().getTime(),
            jenisPenumpang: { value: '', label: 'Pilih Data' },
            nama: '',
            noIdentitas: '0',
            noTelepon: '',
            jenisKelamin: { value: '', label: 'Pilih Data' },
            email: 'test@example.com',
            catatan: '',
            alamat: '',
            kewarnegaraan: { value: 'ID', label: 'Indonesia' },
            jenisPembayaran: { value: 'tunai', label: 'Tunai' }
        }
    ]);
    const [services, setServices] = useState([
        {
            id_harga_service: 0,
            qty: 1,
            harga: 0,
            nama_barang: '',
            jenis_barang: ''
        }
    ]);
    const [telepon, setTelepon] = useState("");
    const [tambahanService, setTambahanService] = useState({
        isTambahanService: false,
        service: { value: '', label: 'Pilih Data' }
    });
    const [serviceList, setServiceList] = useState<IOptions[]>([]);
    const [service, setService] = useState<IOptions[]>([]);
    const [serviceInfo, setServiceInfo] = useState<IHargaService[]>([]);
    const [penumpangInfo, setPenumpangInfo] = useState<IPenumpangInfo[]>([]);
    const [summaryTabel, setSummaryTabel] = useState([
        {
            id: new Date().getTime(),
            keterangan: 'Tiket',
            jenisPenumpang: { value: '', label: 'Pilih Data' },
            qty: 0,
            tarif: 0,
            subtotal: 0
        }
    ]);
    const [total, setTotal] = useState(0);
    const [rute, setRute] = useState<IRute | null>(null);
    const [isPaket, setIsPaket] = useState(false);
    const [showModalPaket, setShowModalPaket] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');
    const [user, setUser] = useState<IUsers | null>(null);
    const [collect, setCollect] = useState<any>({
        isCollect: false,
        total: ''
    });
    const [discon, setDiscon] = useState("");

    useEffect(() => {
        let tmp = getStorageValue('auth');
        if (tmp) {
            setUser(tmp.user);
        }
        setLoading(true);
        const currTiket = getStorageValue('tiket'),
            tglBerangkat = getStorageValue('tanggalKeberangkatan');
        if (currTiket) {
            setTiket(currTiket);
            if (tglBerangkat) {
                setTanggalKeberangkatan(new Date(tglBerangkat));
            } else {
                setTanggalKeberangkatan(new Date());
            }
        }
        getAgenAction(
            {
                limit: 100,
                status: 1
            },
            (data) => {
                setAgen(data.data.map((item: IAgen) => ({
                    value: item.id,
                    label: item.nama_agen
                })));
                setAgenOrigin(data.data);
                getJenisPenumpangByIdAction(
                    queryParams.get('id'),
                    (data) => {
                        setJenisPenumpang(data.data.map((item: any) => ({
                            value: item.id_jenis_penumpang,
                            label: item.jenis_penumpang
                        })));
                        setPenumpangInfo(data.data);
                        getHargaServiceAction(
                            {
                                limit: 100,
                                status: 1
                            },
                            (data) => {
                                setService(data.data.map((item: IHargaService) => ({
                                    value: item.id,
                                    label: item.nama_barang,
                                    harga: item.harga,
                                    jenis: item.jenis_barang
                                })));
                                setServiceInfo(data.data);
                                getRuteDetail(currTiket);
                            },
                            (err) => {
                                setLoading(false);
                                toast.error(err, toastErrorConfig);
                            },
                            () => { router.replace('/login') }
                        );
                    },
                    (err) => {
                        setLoading(false);
                        toast.error(err, toastErrorConfig);
                    },
                    () => { router.replace('/login') }
                );
            },
            (err) => {
                setLoading(false);
                toast.error(err, toastErrorConfig);
            },
        );
    }, []);

    useEffect(() => {
        onValueChanged();
    }, [rombongan.length]);

    useEffect(() => {
        onValueChanged();
    }, [services.length]);

    useEffect(() => {
        onValueChanged();
    }, [ppInfo.id_tiket, jenisPerjalanan]);

    useEffect(() => {
        onValueChanged();
    }, [discon]);

    useEffect(() => {
        checkLimit();
    }, [total]);

    const checkLimit = () => {
        if (agenHolder && agenHolder.sisa_limit) {
            if (agenHolder.sisa_limit < total) {
                toast.error('Total Melebihi limit yang tersisa', toastErrorConfig);
            }
        }
    }

    const back = () => {
        router.back();
    }

    const barangSpawner = () => {
        if(tambahanService.isTambahanService){
            return (
                <>
                    {services.map((item, index) => (
                        <div className="mb-4" key={index}>
                            <NumberSeparator
                                value={index + 1}
                                onClick={() => hapusService(index)}
                                enable={services.length > 1}
                            />
                            <SelectBox
                                label="Barang"
                                placeholder="Pilih data"
                                option={service}
                                onValueHasChanged={onValueChanged}
                                onChange={(e) => setServices(services.map((itm, idx) => {
                                    if (index === idx) {
                                        return {
                                            ...item,
                                            harga: e.harga,
                                            id_harga_service: e.value,
                                            jenis_barang: e.jenis,
                                            nama_barang: e.label
                                        };
                                    }
                                    return itm;
                                }))}
                                value={{ value: String(item.id_harga_service), label: item.nama_barang }}
                            />
                            <InputQty
                                label="Jumlah Barang"
                                placeholder="1"
                                value={item.qty}
                                onChangeText={(e) => setServices(services.map((itm, idx) => {
                                    if (index === idx) {
                                        return {
                                            ...item,
                                            qty: e
                                        };
                                    }
                                    return itm;
                                }))}
                            />
                        </div>
                    ))}
                </>
            );
        }
    };    

    const getRuteDetail = (slugTiket: IPenjualanTiket) => {
        // to reverse start and destination when user choose Pulang Pergi
        if (!slugTiket) return;
        getDetailRuteAction(
            slugTiket.id_rute,
            (data) => {
                setRute(data);
                setLoading(false);
            },
            (err) => {
                setLoading(false);
                toast.error(err, toastErrorConfig);
            },
            () => router.replace('/login')
        );
    }

    const tambahPenumpang = () => {
        if (!tiket) {
            return;
        }
        const sisaKursi = tiket.sisa_kursi, passangers = rombongan.length + 1;
        if (passangers > sisaKursi) {
            toast.error('Maaf, kapasitas tersedia tidak cukup untuk menambahkan penumpang lagi :(');
            return;
        }
        const tmp = JSON.parse(JSON.stringify(rombongan));
        setRombongan([...tmp, {
            id: new Date().getTime(),
            jenisPenumpang: { value: '', label: 'Pilih Data' },
            nama: '',
            noIdentitas: '',
            jenisKelamin: { value: '', label: 'Pilih Data' },
            email: 'test@example.com',
            catatan: '-',
            alamat: '',
            kewarnegaraan: { value: '', label: 'Pilih Data' },
            jenisPembayaran: { value: '', label: 'Pilih Data' }
        }]);
    }

    const hapusPenumpang = (index: number) => {
        if (index > -1) {
            let tmp = [...rombongan];
            tmp.splice(index, 1);
            setRombongan(tmp);
        }
    }

    const tambahService = () => {
        if (!tiket) {
            return;
        }
        const tmp = JSON.parse(JSON.stringify(services));
        setServices([...tmp, {
            id_harga_service: 0,
            qty: 1,
            harga: 0,
            nama_barang: '',
            jenis_barang: ''
        }]);
    }

    const hapusService = (index: number) => {
        if (index > -1) {
            let tmp = [...services];
            tmp.splice(index, 1);
            setServices(tmp);
        }
    }

    const onJenisPenumpangChanged = (e: any, index: number) => {
        setRombongan(rombongan.map((itm, idx) => {
            if (index == idx) {
                return {
                    ...rombongan[index],
                    jenisPenumpang: e
                }
            }
            return itm;
        }));
    }

    const onValueChanged = () => {
        const jenisIdOnly = penumpangInfo.map((item) => item.id_jenis_penumpang);
        let summary = [];
        for (let i = 0; i < jenisIdOnly.length; i++) {
            let id = jenisIdOnly[i].toString();
            let tmp = rombongan.filter((item) => item.jenisPenumpang.value == id);
            if (tmp.length <= 0) {
                // do nothing
            }
            else {
                let diskon = 0, subtotal = 0;
                if (jenisPerjalanan == 'pulang_pergi') {
                    subtotal = (tmp.length * 2) * penumpangInfo[i].harga_tiket; //kali 2 karena PP (pulang pergi)
                    if (discon !== '') {
                        diskon = parseFloat(discon) * 2;
                    }
                    subtotal = subtotal - diskon;
                    summary.push({
                        id: new Date().getTime(),
                        keterangan: 'Tiket',
                        jenisPenumpang: tmp[0].jenisPenumpang,
                        qty: tmp.length * 2,
                        tarif: penumpangInfo[i].harga_tiket,
                        subtotal: subtotal,
                        diskon: 'Rp. ' + convertLabelToPrice(diskon.toString())
                    });
                } else {
                    subtotal = tmp.length * penumpangInfo[i].harga_tiket;
                    if (discon !== '') {
                        diskon = parseFloat(discon);
                    }
                    subtotal = subtotal - diskon;
                    summary.push({
                        id: new Date().getTime(),
                        keterangan: 'Tiket',
                        jenisPenumpang: tmp[0].jenisPenumpang,
                        qty: tmp.length,
                        tarif: penumpangInfo[i].harga_tiket,
                        subtotal: subtotal,
                        diskon: 'Rp. ' + convertLabelToPrice(diskon.toString())
                    });
                }
            }
        }
        if(tambahanService.isTambahanService){
            services.map((s) => {
                summary.push({
                    id: new Date().getTime(),
                    keterangan: 'Barang',
                    jenisPenumpang: {value: s.id_harga_service, label: s.jenis_barang + ' - ' + s.nama_barang},
                    qty: s.qty,
                    tarif: s.harga,
                    subtotal: s.harga * s.qty,
                    // diskon: 'Rp. ' + convertLabelToPrice(s.toString())
                });
            })
        }
        setSummaryTabel(summary);
        let total = summary.reduce((prev, next) => {
            return prev + next.subtotal;
        }, 0);
        setTotal(total);
    }

    const onPribadiFocus = () => {
        let tmp = [...rombongan];
        setRombongan([{ ...tmp[0] }]);
    }

    const selectJenisPerjalanan = (jenis: 'sekali_jalan' | 'pulang_pergi') => {
        setjenisPerjalanan(jenis);
        if (jenis == 'pulang_pergi') {
            setShowModal(true);
            return;
        }
        setPpInfo({
            id_tiket: '',
            tanggal_balik: new Date(),
            jamBalik: '',
            demagaAsal: { value: '', label: 'Pilih Data' },
            demagaTujuan: { value: '', label: 'Pilih Data' }
        });
        onValueChanged();
    }

    const getPenumpang = (no_telp: string, index: number) => {
        setLoading(true);
        getDetailPenumpangByPhone(
            no_telp,
            (data)=>{
                setRombongan(rombongan.map((itm, idx) => {
                    if (index == idx) {
                        var kelamin = '';
                        if(data.jenis_kelamin == "0"){
                            kelamin = "Laki - laki"
                        }else{
                            kelamin = "Perempuan"
                        }
                        return {
                            ...itm,
                            nama: data.nama,
                            noIdentitas: data.no_identitas,
                            jenisKelamin: { value: data.jenis_kelamin, label: kelamin },
                            email: data.email 
                        }
                    }
                    return itm;
                }));
                setLoading(false);
                toast.success('Penumpang ditemukan.', toastSuccessConfig);
            },
            ()=>{
                toast.error('Penumpang tidak ditemukan!', toastErrorConfig);
                setLoading(false);
            }
        );
    }

    function jenisPenumpangSiwalatri(jenis: string) {
        if (jenis.includes('Domestik')) {
            return 1;
          } else if (jenis.includes('Mancanegara')) {
            return 2;
          } else if (jenis.includes('Lokal')) {
            return 3;
          } else if (jenis.includes('Domestik (PP)')) {
            return 4;
          } else if (jenis.includes('Mancanegara (PP)')) {
            return 5;
          } else if (jenis.includes('Lokal (PP)')) {
            return 6;
          }
    }

    const save = () => {
        if (!tiket) {
            toast.error('Jadwal tidak ditemukan!', toastErrorConfig);
            return;
        }
        if ((agenHolder && agenHolder.sisa_limit) && agenHolder.sisa_limit < total) {
            checkLimit();
            return;
        }
        const tmp = getStorageValue('auth');
        if (tmp && tmp.user) {
            if (tmp.user.id_role == 1) {
                if (!selectedAgen.value) {
                    toast.error('Pastikan Anda telah memilih Agen!');
                    return;
                }
            }
        }
        if(collect.isCollect && !collect.total) {
            toast.error('Pastikan Anda telah memasukkan nominal collect!');
            return;
        }
        setLoadingMessage('Menyimpan Data...');
        setLoading(true);
        const penumpangs = rombongan.map((item) => {
            let tmp = penumpangInfo.filter((itm) => itm.id_jenis_penumpang.toString() == item.jenisPenumpang.value);
            if (tmp.length <= 0) {
                return;
            }
            return {
                id_jenis_tiket: tmp[0].id_jenis_tiket,
                nama_penumpang: item.nama,
                no_identitas: item.noIdentitas,
                no_telepon: item.noTelepon,
                jenis_kelamin: item.jenisKelamin.value == 'Laki-laki' ? 'l' : 'p',
                email: item.email,
                catatan: item.catatan,
                alamat: item.alamat,
                kewarnegaraan: item.kewarnegaraan.value,
                jenisPembayaran: item.jenisPembayaran.value
            }
        });
        const people = rombongan.map((item, index) => {
            let tmp = penumpangInfo.filter((itm) => itm.id_jenis_penumpang.toString() == item.jenisPenumpang.value);
            if (tmp.length <= 0) {
                return;
            }
            return {
                alamat: item.alamat,
                catatan: item.catatan,
                email: item.email,
                freepass: 0,
                harga_tiket: 100000,
                id_jadwal: queryParams.get('id'),
                id_jns_penum: jenisPenumpangSiwalatri(item.jenisPenumpang.label),
                id_tiket: 1,
                id_tujuan: "1",
                jenis_kelamin: item.jenisKelamin.value == 'Laki-laki' ? 1 : 0,
                nama_penumpang: item.nama,
                no_identitas: item.noIdentitas,
                payment_method: item.jenisPembayaran.value == "tunai" ? "cash" : "transfer",
                status_verif: 0,
                tanggal: parseDateToBackendFormat(tanggalKeberangkatan),
            }
        });
        let tmpService: { id_harga_service: number; qty: number; }[] = []
        if (tambahanService.isTambahanService) {
            services.map((s) => {
                tmpService.push({
                    id_harga_service: s.id_harga_service,
                    qty: s.qty
                })
            })
        }
        createPenjualanAction(
            {
                tanggal: parseDateToBackendFormat(tanggalKeberangkatan),
                id_agen: selectedAgen.value,
                diskon_agen: discon,
                // id_service: tambahanService.service.value,
                penumpangs: penumpangs,
                tanggal_pulang: jenisPerjalanan == 'pulang_pergi' ? parseDateToBackendFormat(ppInfo.tanggal_balik) : undefined,
                id_jadwal_pulang: jenisPerjalanan == 'pulang_pergi' ? ppInfo.id_tiket : undefined,
                collect: collect.isCollect ? convertLabelPriceToNumeberPrice(collect.total) : undefined,
                services: tmpService
            },
            (data1) => {
                createPenjualanSiwalatriAction(
                    {
                        data: people
                    },
                    (data) => {
                        setLoading(false);
                        let bayar = {};
                        let tot = 0;
                        bayar = {
                            no_invoice: data1[0].no_invoice,
                            metode_bayar: rombongan[0].jenisPembayaran.value,
                            nominal: total
                        };
                        createPembayaranAction(
                            bayar,
                            ()=>{
                                if (data.length > 0) {
                                    toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                                    setTimeout(() => {
                                        // router.replace('/penjualan-tiket');
                                        router.replace('/pembayaran-agen/detail-invoice?id='+data1[0].no_invoice);
                                    }, 500);
                                }
                            },
                            (err)=>{
                                setLoading(false);
                                toast.error(err, toastErrorConfig);
                            }
                        );
                    },
                    (err) => {
        
                        setLoading(false);
                        toast.error(err, toastErrorConfig);
                    },
                );
                // setLoading(false);
                // if (data.length > 0) {
                //     toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                //     setTimeout(() => {
                //         router.replace('/penjualan-tiket');
                //     }, 500);
                // }
            },
            (err) => {
                setLoading(false);
                toast.error(err, toastErrorConfig);
            },
            () => { router.replace('/login') }
        );
        
    }

    const selectAgen = (e: IOptions) => {
        setSelectedAgen(e);
        const tmp = agenOrigin.filter((item) => `${item.id}` == e.value);
        if (tmp.length > 0) {
            setAgenHolder(tmp[0]);
        }
    }

    const makePaket = () => {
        let tmpRombongan = rombongan[0];
        if (
            tmpRombongan.nama &&
            tmpRombongan.jenisPenumpang.value &&
            tmpRombongan.email &&
            tmpRombongan.jenisKelamin.value &&
            tmpRombongan.noIdentitas
        ) {
            if (isPaket) {
                if (confirm('Apakah Anda yakin membatalkan Paket?')) {
                    setIsPaket(false);
                    cancelPaket();
                }
            } else {
                setIsPaket(true);
                setShowModalPaket(true);
            }
            return;
        }
        toast.error('Silakan lengkapi identitas Penumpang terlebih dahulu untuk dapat menentukan Paket');
    }

    const cancelPaket = () => {
        setShowModalPaket(false);
        setIsPaket(false);
        let currRombongan = rombongan[0];
        setRombongan([currRombongan]);
    }

    const confirmPaket = (jumlah: string) => {
        let jum = parseInt(jumlah) - 1;
        setShowModalPaket(false);
        let tmpRombongan = [],
            currRombongan = rombongan[0];
        for (let i = 0; i < jum; i++) {
            tmpRombongan.push({
                ...currRombongan,
                id: new Date().getTime(),
            });
        }
        setRombongan([currRombongan, ...tmpRombongan]);
    }

    const setTanggalBalik = (date: Date) => {
        setPpInfo({
            ...ppInfo,
            tanggal_balik: date
        });
        setTanggalBalik2(date);
    }

    return (
        <BaseContainer>
            <CustomBreadcumb
                title="Penjualan Tiket"
                onBack={back}
            />
            {user && user.id_role == 1 ? 
                <BaseCard>
                    <SelectBox
                        label="Agen"
                        placeholder="Pilih data"
                        option={agen}
                        onChange={selectAgen}
                        value={selectedAgen}
                    />
                    <div className="font-robotomedium text-primary text-sm">Sisa Limit : Rp. {(agenHolder && agenHolder.sisa_limit) && agenHolder.sisa_limit < 0 ? '(Minus)' : ''} {convertLabelToPrice(`${agenHolder && agenHolder.sisa_limit ? agenHolder.sisa_limit : '0'}`)}</div>
                </BaseCard>
            : null}
            <div className="my-4 relative flex justify-between">
                <div className="w-full h-auto mr-4 bg-white dark:bg-slate-700 p-2 sm:p-8 rounded-xl">
                    <div className="sm:grid gap-x-6 grid-cols-2">
                        <Input
                            label="Dermaga Asal"
                            value={tiket?.dermaga_awal}
                            placeholder=""
                            onChangeText={() => { }}
                            disabled
                        />
                        <Input
                            label="Dermaga Tujuan"
                            value={tiket?.dermaga_tujuan}
                            placeholder=""
                            onChangeText={() => { }}
                            disabled
                        />
                        <DatePicker
                            label="Tanggal Keberangkatan"
                            value={tanggalKeberangkatan}
                            onChange={setTanggalKeberangkatan}
                        />
                        <SelectBox
                            label="Waktu Keberangkatan"
                            placeholder="Pilih data"
                            option={timeList}
                            value={{ value: tiket ? tiket.waktu_berangkat : 'Pilih Data', label: tiket ? tiket.waktu_berangkat : 'Pilih Data' }}
                            disable
                        />
                    </div>
                    <div className="flex mt-2">
                        <Radio
                            text="Sekali Jalan"
                            selected={jenisPerjalanan == 'sekali_jalan'}
                            onClick={() => selectJenisPerjalanan('sekali_jalan')}
                        />
                        <div className="ml-6" />
                        <Radio
                            text="Pulang Pergi"
                            selected={jenisPerjalanan == 'pulang_pergi'}
                            onClick={() => selectJenisPerjalanan('pulang_pergi')}
                        />
                    </div>
                    {jenisPerjalanan == 'pulang_pergi' && ppInfo.id_tiket ?
                        <>
                            <div className="w-full h-[1px] bg-slate-300 my-3" />
                            <div className="text-md font-robotomedium mb-2">Jadwal Kembali</div>
                            <div className="sm:grid gap-x-6 grid-cols-2">
                                <Input
                                    label="Dermaga Asal"
                                    value={ppInfo.demagaAsal.label}
                                    placeholder=""
                                    onChangeText={() => { }}
                                    disabled
                                />
                                <Input
                                    label="Dermaga Tujuan"
                                    value={ppInfo.demagaTujuan.label}
                                    placeholder=""
                                    onChangeText={() => { }}
                                    disabled
                                />
                                <DatePicker
                                    label="Tanggal Kembali"
                                    value={ppInfo.tanggal_balik}
                                    onChange={setTanggalBalik}
                                />
                                <SelectBox
                                    label="Waktu Kembali"
                                    placeholder="Pilih data"
                                    option={timeList}
                                    value={{ value: ppInfo.jamBalik, label: ppInfo.jamBalik }}
                                    disable
                                />
                            </div>
                        </>
                        : null}

                </div>
                <div className="min-w-[250px]">
                    {tiket ?
                        <TiketCard
                            jadwal={tiket}
                        />
                        : null}
                </div>
            </div>
            
            <BaseCard>
                <Input
                    label="Diskon"
                    subtitle={'*(Berlaku untuk satu invoice)'}
                    placeholder="Masukkan jumlah diskon"
                    type='diskon'
                    value={discon}
                    onChangeText={(e) => {
                        setDiscon(e.target.value);
                        console.log(e.target.value);
                    }}
                />
                {/* <PriceInput 
                    label="Masukkan Nominal"
                    placeholder="Rp. 2.000.000"
                    value={discon}
                    onChangeText={(e) => {
                        setDiscon(e);
                        console.log(e);
                    }}
                /> */}
            </BaseCard>
            <div className="mt-4"></div>
            <BaseCard>
                <Tabs>
                    <TabList className={'flex'}>
                        <Tab onClick={onPribadiFocus} selectedClassName="bg-primary text-white" className={'border-primary border-2 cursor-pointer flex h-[40px] items-center px-6 text-sm rounded-tl-lg rounded-bl-lg rounded-tr-none'}>Perorangan</Tab>
                        <Tab selectedClassName="bg-primary text-white" className={'border-primary border-2 cursor-pointer flex h-[40px] items-center px-6 text-sm rounded-tr-lg rounded-bl-none rounded-br-lg'}>Rombongan</Tab>
                    </TabList>
                    {/* Pribadi */}
                    <TabPanel>
                        {rombongan.map((item, index) => {
                            if (index > 0) return;
                            return (
                                <div className="mb-4" key={item.id}>
                                    <div className="sm:grid gap-x-6 grid-cols-2 mt-4">
                                        <Input
                                            label="No. Telepon Penumpang"
                                            placeholder="Masukkan nomor telpon penumpang"
                                            value={item.noTelepon}
                                            onChangeText={(e) => {
                                                setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        noTelepon: e.target.value
                                                    }
                                                }
                                                return itm;
                                                }))
                                                setTelepon(e.target.value);
                                            }}
                                        />
                                        <div className="sm:flex sm:flex-col w-full">
                                            <div className="flex items-center mb-2">
                                                <div className="font-robotomedium text-sm" style={{color: 'white'}}>Status: </div>
                                            </div>
                                            <Button
                                                label="Cari Penumpang"
                                                icon={faPlus}
                                                onClick={() => {getPenumpang(telepon, index)}}
                                                outline
                                            />
                                        </div>
                                        <SelectBox
                                            label="Jenis Penumpang"
                                            placeholder="Pilih data"
                                            option={jenisPenumpang}
                                            value={item.jenisPenumpang}
                                            onChange={(e) => onJenisPenumpangChanged(e, index)}
                                            onValueHasChanged={onValueChanged}
                                        />
                                        <Input
                                            label="Nama Penumpang"
                                            placeholder="Masukkan nama penumpang"
                                            value={item.nama}
                                            onChangeText={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        nama: e.target.value
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />
                                        <Input
                                            label="No. Identitas Penumpang (No. KTP / No. Paspor)"
                                            placeholder="Masukkan nomor identitas penumpang"
                                            value={item.noIdentitas}
                                            onChangeText={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        noIdentitas: e.target.value
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />
                                        {item.jenisPenumpang.label.includes("Mancanegara") ? <SelectBox
                                            label="Negara Asal"
                                            placeholder="Pilih data"
                                            option={KEWARNEGARAAN}
                                            value={item.kewarnegaraan}
                                            onChange={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        alamat: e.label,
                                                        kewarnegaraan: e
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        /> : <Input
                                            label="Alamat"
                                            placeholder="Masukkan alamat penumpang"
                                            value={item.alamat}
                                            onChangeText={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        alamat: e.target.value,
                                                        kewarnegaraan: { value: 'ID', label: 'Indonesia' },
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />}
                                        <SelectBox
                                            label="Jenis Kelamin"
                                            placeholder="Pilih data"
                                            option={JENIS_KELAMIN}
                                            value={item.jenisKelamin}
                                            onChange={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        jenisKelamin: e
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />
                                    </div>
                                    <div className="sm:grid gap-x-6 grid-cols-2 mt-4">
                                        <Input
                                            label="Email"
                                            subtitle={'*(Digunakan untuk mengirimkan kode booking)'}
                                            placeholder="Masukkan email penumpang"
                                            type='email'
                                            value={item.email}
                                            onChangeText={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        email: e.target.value
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />
                                        <SelectBox
                                            label="Jenis Pembayaran"
                                            placeholder="Pilih data"
                                            option={JENIS_PEMBAYARAN}
                                            value={item.jenisPembayaran}
                                            onChange={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        jenisPembayaran: e
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />
                                    </div>
                                    <Input
                                        label="Catatan"
                                        placeholder="Masukkan catatan"
                                        value={item.catatan}
                                        onChangeText={(e) => setRombongan(rombongan.map((itm, idx) => {
                                            if (index == idx) {
                                                return {
                                                    ...item,
                                                    catatan: e.target.value
                                                }
                                            }
                                            return itm;
                                        }))}
                                    />
                                </div>
                            );
                        })}
                    </TabPanel>
                    {/* Rombongan */}
                    <TabPanel>
                        {rombongan.map((item, index) => {
                            return (
                                <div className="mb-4" key={item.id}>
                                    <NumberSeparator
                                        value={index + 1}
                                        onClick={() => hapusPenumpang(index)}
                                        enable={rombongan.length > 1}
                                    />
                                    <Input
                                        label="No. Telepon Penumpang"
                                        placeholder="Masukkan nomor telpon penumpang"
                                        value={item.noTelepon}
                                        onChangeText={(e) => {
                                            setRombongan(rombongan.map((itm, idx) => {
                                            if (index == idx) {
                                                return {
                                                    ...item,
                                                    noTelepon: e.target.value
                                                }
                                            }
                                            return itm;
                                            }))
                                            setTelepon(e.target.value);
                                        }}
                                    />
                                    <div className="sm:flex sm:flex-col w-full" style={{marginBottom: '20px'}}>
                                        <Button
                                            label="Cari Penumpang"
                                            icon={faPlus}
                                            onClick={() => {getPenumpang(telepon, index)}}
                                            outline
                                        />
                                    </div>
                                    <div className="sm:grid gap-x-6 grid-cols-2">
                                        <SelectBox
                                            label="Jenis Penumpang"
                                            placeholder="Pilih data"
                                            option={jenisPenumpang}
                                            value={item.jenisPenumpang}
                                            onChange={(e) => onJenisPenumpangChanged(e, index)}
                                            onValueHasChanged={onValueChanged}
                                        />
                                        <Input
                                            label="Nama Penumpang"
                                            placeholder="Masukkan nama penumpang"
                                            value={item.nama}
                                            onChangeText={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        nama: e.target.value
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />
                                        <Input
                                            label="No. Identitas Penumpang (No. KTP / No. Paspor)"
                                            placeholder="Masukkan nomor identitas penumpang"
                                            value={item.noIdentitas}
                                            onChangeText={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        noIdentitas: e.target.value
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />
                                        {item.jenisPenumpang.label.includes("Mancanegara") ? <SelectBox
                                            label="Negara Asal"
                                            placeholder="Pilih data"
                                            option={KEWARNEGARAAN}
                                            value={item.kewarnegaraan}
                                            onChange={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        alamat: e.label,
                                                        kewarnegaraan: e
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        /> : <Input
                                            label="Alamat"
                                            placeholder="Masukkan alamat penumpang"
                                            value={item.alamat}
                                            onChangeText={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        alamat: e.target.value,
                                                        kewarnegaraan: { value: 'ID', label: 'Indonesia' },
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />}
                                        <SelectBox
                                            label="Jenis Kelamin"
                                            placeholder="Pilih data"
                                            option={JENIS_KELAMIN}
                                            value={item.jenisKelamin}
                                            onChange={(e) => setRombongan(rombongan.map((itm, idx) => {
                                                if (index == idx) {
                                                    return {
                                                        ...item,
                                                        jenisKelamin: e
                                                    }
                                                }
                                                return itm;
                                            }))}
                                        />
                                    </div>
                                    <Input
                                        label="Email"
                                        subtitle={'*(Digunakan untuk mengirimkan kode booking)'}
                                        placeholder="Masukkan email penumpang"
                                        type='email'
                                        value={item.email}
                                        onChangeText={(e) => setRombongan(rombongan.map((itm, idx) => {
                                            if (index == idx) {
                                                return {
                                                    ...item,
                                                    email: e.target.value
                                                }
                                            }
                                            return itm;
                                        }))}
                                    />
                                </div>
                            );
                        })}
                        <div className="flex justify-end">
                            <div className="w-[200px]">
                                <Button
                                    label={isPaket ? "Batalkan Paket" : "Jadikan Paket"}
                                    icon={faPlus}
                                    onClick={makePaket}
                                    outline
                                />
                            </div>
                            {!isPaket ?
                                <div className="w-[200px] ml-2">
                                    <Button
                                        label="Tambah Penumpang"
                                        icon={faPlus}
                                        onClick={tambahPenumpang}
                                    />
                                </div>
                                : null}
                        </div>
                    </TabPanel>
                </Tabs>
            </BaseCard>
            <div className="mt-4"></div>
            {/* <BaseCard>
                <img src={seat.src} />
            </BaseCard>
            <div className="mt-4"></div> */}
            <BaseCard>
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <div>
                        <CheckBox
                            text="Tambahan Barang"
                            selected={tambahanService.isTambahanService}
                            onClick={() => setTambahanService({
                                ...tambahanService,
                                isTambahanService: !tambahanService.isTambahanService
                            })}
                        />
                    </div>
                    <div>
                        <CheckBox
                            text="Collect"
                            selected={collect.isCollect}
                            onClick={() => setCollect({
                                ...collect,
                                isCollect: !collect.isCollect
                            })}
                        />
                        {collect.isCollect?
                            <>
                                <div className="mt-4" />
                                <PriceInput
                                    label="Nominal Collect"
                                    placeholder="ex: 500.000"
                                    value={collect.total}
                                    onChangeText={(e) => setCollect({
                                        ...collect,
                                        total: e
                                    })}
                                    disabled={false}
                                />
                            </>
                        : null}
                    </div>
                </div>
                
            </BaseCard>
            
            {tambahanService.isTambahanService ? <><div className="mt-4"></div>
            
            <BaseCard>
                <div className="sm:grid gap-x-6 grid-cols-2">
                    {barangSpawner()}
                </div>
                <div>
                    <div className="w-[200px] ml-2">
                        <Button
                            label="Tambah Barang"
                            icon={faPlus}
                            onClick={tambahService}
                        />
                    </div>
                </div>
            </BaseCard></> : null}

            <div className="mt-4"></div>
            <BaseCard>
                <PricingTable
                    summaryTabel={summaryTabel}
                    total={total}
                    jenisPerjalanan={jenisPerjalanan}
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
            <CustomModal
                modalIsOpen={showModal}
                closeModal={() => setShowModal(false)}
            >
                <SearchTiketModal
                    rute={rute!}
                    close={() => setShowModal(false)}
                    tglKebrangkatan={tanggalBalik}
                    waktuKeberangkatan={tiket?.waktu_berangkat}
                    onJadwalSelect={(e) => setPpInfo(e)}
                />
            </CustomModal>
            <CustomModal
                modalIsOpen={showModalPaket}
                closeModal={cancelPaket}
            >
                <PaketModal
                    close={cancelPaket}
                    onConfirm={confirmPaket}
                />
            </CustomModal>
            <ToastContainer />
        </BaseContainer>
    );
}