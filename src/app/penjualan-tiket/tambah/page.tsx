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
import { getHargaServiceAction } from "@/app/master-data/service/hargaService.service";
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

export default function AddPenjualanTiket() {
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [jenisPenumpang, setJenisPenumpang] = useState<IOptions[]>([]);
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
    const [telepon, setTelepon] = useState("");
    const [tambahanService, setTambahanService] = useState({
        isTambahanService: false,
        service: { value: '', label: 'Pilih Data' }
    });
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
                                    label: item.area_jemput
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
        if (tambahanService.isTambahanService && tambahanService.service.value) {
            let tmp = serviceInfo.filter((item) => item.id.toString() == tambahanService.service.value);
            if (tmp.length > 0) {
                let preSummary = summaryTabel;
                preSummary = preSummary.filter((item) => item.jenisPenumpang.value != 'service');
                let qty = preSummary.reduce((acc, prev) => {
                    return acc + prev.qty
                }, 0);
                let harga = tmp[0].harga,
                    newService = {
                        id: new Date().getTime(),
                        keterangan: 'Bagasi - 5KG',
                        jenisPenumpang: { value: 'service', label: '-' },
                        qty: jenisPerjalanan == 'pulang_pergi' ? qty / 2 : qty,
                        tarif: harga,
                        subtotal: jenisPerjalanan == 'pulang_pergi' ? qty / 2 * harga : qty * harga,
                        diskon: '-'
                    };
                let sum = [...preSummary, newService];
                let tot = sum.reduce((acc, prev) => {
                    return acc + prev.subtotal
                }, 0)
                setSummaryTabel(sum);
                setTotal(tot);
            }
        }
    }, [tambahanService.service.value]);

    useEffect(() => {
        if (!tambahanService.isTambahanService) {
            let preSummary = summaryTabel;
            preSummary = preSummary.filter((item) => item.jenisPenumpang.value != 'service');
            setSummaryTabel(preSummary);
            let total = preSummary.reduce((prev, next) => {
                return prev + next.subtotal;
            }, 0);
            setTotal(total);
            setTambahanService({
                ...tambahanService,
                service: { value: '', label: 'Pilih Data' }
            });
        }
    }, [tambahanService.isTambahanService]);

    useEffect(() => {
        onValueChanged();
    }, [ppInfo.id_tiket, jenisPerjalanan]);

    useEffect(() => {
        onValueChanged();
    }, [discon]);

    // useEffect(() => {
    //     if (agenHolder?.id) {
    //         const temp = summaryTabel.map((item) => {
    //             if (item.keterangan == 'Penjemputan') {
    //                 return {
    //                     ...item,
    //                     diskon: '-'
    //                 }
    //             }
    //             return {
    //                 ...item,
    //                 diskon: agenHolder.jenis_diskon == 'persen' ? agenHolder.nominal_diskon + '%' : 'Rp. ' + convertLabelToPrice(`${agenHolder.nominal_diskon}`)
    //             };
    //         });
    //         checkLimit();
    //         setSummaryTabel(temp);
    //         onValueChanged();

    //     }
    // }, [agenHolder?.id]);

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
                    // if (agenHolder && agenHolder.jenis_diskon == 'persen') {
                    //     diskon = (agenHolder.nominal_diskon / 100) * subtotal;
                    //     subtotal = subtotal - diskon;
                    // }
                    // if (agenHolder && agenHolder.jenis_diskon == 'nominal') {
                    //     diskon = agenHolder.nominal_diskon * (tmp.length * 2); //kali 2karena PP (pulang pergi)
                    //     subtotal = subtotal - diskon;
                    // }
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
                    // if (agenHolder && agenHolder.jenis_diskon == 'persen') {
                    //     diskon = (agenHolder.nominal_diskon / 100) * subtotal;
                    //     subtotal = subtotal - diskon;
                    // }
                    // if (agenHolder && agenHolder.jenis_diskon == 'nominal') {
                    //     diskon = agenHolder.nominal_diskon * tmp.length;
                    //     subtotal = subtotal - diskon;
                    // }
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
        const service = summaryTabel.filter((item) => item.jenisPenumpang.value == 'service');
        if (service.length > 0) {
            let qty = summary.reduce((acc, curr) => {
                return acc + curr.qty
            }, 0);
            let tmp = serviceInfo.filter((item) => item.id.toString() == tambahanService.service.value);
            let harga = tmp[0].harga;
            if (jenisPerjalanan == 'pulang_pergi') {
                qty = qty / 2;
            }
            summary.push({
                ...service[0],
                qty: qty,
                tarif: harga,
                subtotal: qty * harga
            });
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
                console.log(data);
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
                alamat: "ditempat",
                catatan: item.catatan,
                email: item.email,
                freepass: 0,
                harga_tiket: 100000,
                id_jadwal: queryParams.get('id'),
                id_jns_penum: 1,
                id_tiket: 1,
                id_tujuan: "1",
                jenis_kelamin: item.jenisKelamin.value == 'Laki-laki' ? 1 : 0,
                nama_penumpang: item.nama,
                no_identitas: item.noIdentitas,
                payment_method: "cash",
                status_verif: 0,
                tanggal: parseDateToBackendFormat(tanggalKeberangkatan),
            }
        });
        
        createPenjualanAction(
            {
                tanggal: parseDateToBackendFormat(tanggalKeberangkatan),
                id_agen: selectedAgen.value,
                diskon_agen: discon,
                id_service: tambahanService.service.value,
                penumpangs: penumpangs,
                tanggal_pulang: jenisPerjalanan == 'pulang_pergi' ? parseDateToBackendFormat(ppInfo.tanggal_balik) : undefined,
                id_jadwal_pulang: jenisPerjalanan == 'pulang_pergi' ? ppInfo.id_tiket : undefined,
                collect: collect.isCollect ? convertLabelPriceToNumeberPrice(collect.total) : undefined
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
                            metode_bayar: "tunai",
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
                            text="Tambahan Bagasi"
                            selected={tambahanService.isTambahanService}
                            onClick={() => setTambahanService({
                                ...tambahanService,
                                isTambahanService: !tambahanService.isTambahanService
                            })}
                        />
                        {tambahanService.isTambahanService ?
                            <>
                                <div className="mt-4" />
                                <SelectBox
                                    label="Bagasi"
                                    placeholder="Pilih data"
                                    option={service}
                                    onChange={(e) => setTambahanService({
                                        ...tambahanService,
                                        service: e
                                    })}
                                    value={tambahanService.service}
                                />
                            </>
                        : null}
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
                                />
                            </>
                        : null}
                    </div>
                </div>
                
            </BaseCard>

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