'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { SelectBox } from "@/app/components/SelectBox";
import { convertLabelToPrice, parseDateToBackendFormat, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/Input";
import { DatePicker } from "@/app/components/DatePicker";
import { Radio } from "@/app/components/Radio";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Button } from "@/app/components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { CheckBox } from "@/app/components/CheckBox";
import { useEffect, useState } from "react";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { toast, ToastContainer } from "react-toastify";
import { IOptions, IUsers } from "@/app/types/auth";
import { getAgenAction } from "@/app/master-data/agen/agen.service";
import { IAgen } from "@/app/types/agen";
import { IPenjualanTiket, IPenumpangInfo } from "@/app/types/jadwal";
import { getStorageValue } from "@/app/utils/localstoreage";
import { JENIS_KELAMIN } from "@/app/constants/jenisKelamin";
import { IHargaService } from "@/app/types/hargaService";
import { getHargaServiceAction } from "@/app/master-data/service/hargaService.service";
import { IRute } from "@/app/types/rute";
import { CustomModal } from "@/app/components/CustomModal";
import { PaketModal } from "@/app/penjualan-tiket/components/PaketModal";
import { createPenjualanAction, editTiketPenumpangAction, getJenisPenumpangByIdAction } from "@/app/penjualan-tiket/penjualanTiket.service";
import { TiketCard } from "@/app/penjualan-tiket/components/TiketCard";
import { NumberSeparator } from "@/app/penjualan-tiket/components/NumberSeparator";
import { PricingTable } from "@/app/penjualan-tiket/components/PricingTable";
import { SearchTiketModal } from "@/app/penjualan-tiket/components/SearchTiketModal";
import { useInvoiceDetail } from "@/hooks/invoice.hook";
import { constructPassangers, constructService } from "./helper/passanger";
import { mapDetailToTiket } from "./helper/mapDetailToTiket";
import { calculateService } from "./helper/calculateService";
import { calculateTotal } from "./helper/calculateTotal";
import { constructParams } from "./helper/constructParams";

export default function EditCoreInvoice() {
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [jenisPenumpang, setJenisPenumpang] = useState<IOptions[]>([]);
    const [agen, setAgen] = useState<IOptions[]>([]);
    const [selectedAgen, setSelectedAgen] = useState({ value: '', label: 'Pilih Data' });
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
    const [keberangkatanInfo, setKeberangkatanInfo] = useState({
        id_tiket: '',
        tanggal_balik: new Date(),
        jamBalik: '',
        demagaAsal: { value: '', label: 'Pilih Data' },
        demagaTujuan: { value: '', label: 'Pilih Data' }
    });
    const [rombongan, setRombongan] = useState<any[]>([
        {
            id: new Date().getTime(),
            jenisPenumpang: { value: '', label: 'Pilih Data' },
            nama: '',
            noIdentitas: '',
            jenisKelamin: { value: '', label: 'Pilih Data' },
            email: '',
            pembayaran: "cash",
        }
    ]);
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
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');
    const [user, setUser] = useState<IUsers | null>(null);
    const [detail, getDetail] = useInvoiceDetail(queryParams.get('invoice'));
    const [showModalKeberangkatan, setShowModalKeberangkatan] = useState(false);

    useEffect(() => {
        let tmp = getStorageValue('auth');
        if (tmp) {
            setUser(tmp.user);
        }
        setLoading(true);
        getDetail(queryParams.get('invoice'));
    }, []);

    useEffect(() => {
        onValueChanged();
    }, [rombongan.length]);

    useEffect(() => {
        if (tambahanService.isTambahanService && tambahanService.service.value) {
            const {summary, total} = calculateService({serviceInfo, tambahanService, summaryTabel, jenisPerjalanan});
            setSummaryTabel(summary);
            setTotal(total);
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
        if (agenHolder?.id) {
            const temp = summaryTabel.map((item) => {
                if (item.keterangan == 'Penjemputan') {
                    return {
                        ...item,
                        diskon: '-'
                    }
                }
                return {
                    ...item,
                    diskon: agenHolder.jenis_diskon == 'persen' ? agenHolder.nominal_diskon + '%' : 'Rp. ' + convertLabelToPrice(`${agenHolder.nominal_diskon}`)
                };
            });
            checkLimit();
            setSummaryTabel(temp);
            onValueChanged();
        }
    }, [agenHolder?.id]);

    useEffect(() => {
        checkLimit();
    }, [total]);

    useEffect(() => {
        if (detail) {
            setTanggalKeberangkatan(new Date(detail.penumpang[0].tanggal));
            //set tiket from detail jadwal
            setTiket(mapDetailToTiket(detail.detail_jadwal));
            if (detail.detail_jadwal_pulang) {
                setjenisPerjalanan('pulang_pergi');
                const jadwalPulang = detail.detail_jadwal_pulang;
                setPpInfo({
                    id_tiket: jadwalPulang.id,
                    tanggal_balik: jadwalPulang.tanggal_berangkat,
                    jamBalik: jadwalPulang.waktu_berangkat,
                    demagaAsal: { value: jadwalPulang.id_dermaga_awal, label: jadwalPulang.dermaga_awal },
                    demagaTujuan: { value: jadwalPulang.id_dermaga_tujuan, label: jadwalPulang.dermaga_tujuan }
                });
            }
            //set rombongan from detail penumpang
            setRombongan(constructPassangers(detail.penumpang));
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
                    if(detail.agen !== null ){
                        selectAgen({value: detail.agen.id, label: detail.agen.nama_agen}, data.data);
                    }
                    getJenisPenumpangByIdAction(
                        detail.detail_jadwal.id,
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
                                    setLoading(false);
                                    //set service from detail
                                    setTimeout(() => {
                                        setTambahanService(constructService(detail));
                                    }, 1000);
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
        }
    }, [detail]);

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

    const hapusPenumpang = (index: number) => {
        if (index > -1) {
            let tmp = [...rombongan];
            tmp.splice(index, 1);
            setRombongan(tmp);
        }
    }

    const onJenisPenumpangChanged = (e: any, index: number) => {
        setRombongan(rombongan.map((itm: any, idx: number) => {
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
        const {summary, total} = calculateTotal({
            penumpangInfo, 
            rombongan, 
            jenisPerjalanan, 
            agenHolder, 
            summaryTabel,
            serviceInfo,
            tambahanService
        });
        setSummaryTabel(summary);
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

    const save = () => {
        if (!tiket) {
            toast.error('Jadwal tidak ditemukan!', toastErrorConfig);
            return;
        }
        if(detail.agen !== null ){
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
        }
        
        setLoadingMessage('Menyimpan Data...');
        setLoading(true);
        const params = constructParams({
            invoice: queryParams.get('invoice'),
            selectedAgen,
            tambahanService,
            jenisPerjalanan,
            tanggalKeberangkatan,
            tanggalKembali: ppInfo.tanggal_balik,
            penumpang: rombongan,
            id_jadwal: tiket?.id_jadwal || 0,
            id_jadwal_pulang: ppInfo && ppInfo.id_tiket ? ppInfo.id_tiket : 0
        });
        console.log(params);
        editTiketPenumpangAction(
            params,
            ()=> {
                setLoading(false);
                toast.success('Data Berhasil Disimpan', toastSuccessConfig);
                setTimeout(() => {
                    back();
                }, 500);
            },
            ()=> {
                setLoading(false);
            }
        );
    }

    const selectAgen = (e: IOptions, origin?: any[]) => {
        setSelectedAgen(e);
        let tmp = [];
        if (agenOrigin.length == 0) {
            tmp = agenOrigin.filter((item) => `${item.id}` == e.value);
        }
        if (origin && origin.length > 0) {
            tmp = origin.filter((item) => `${item.id}` == e.value);
        }
        if (tmp.length > 0) {
            setAgenHolder(tmp[0]);
        }
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

    const onSelectJadwalKeberangkatan = (e: any) => {
        console.log('current tiket = ', e);
        setRombongan(rombongan.map((itm: any, idx: number) => {
                return {
                    ...itm,
                    id: e.id_jadwal
                }
            }
        ));
        setKeberangkatanInfo(e);
        setTiket({
            ...tiket!,
            id: e.id_tiket,
            id_jadwal: e.id_jadwal,
            dermaga_awal: e.demagaAsal.label,
            dermaga_tujuan: e.demagaTujuan.label,
            waktu_berangkat: e.jamBalik,
            nama_nahkoda: e.nama_nahkoda,
            nama_kapal: e.nama_kapal,
            sisa_kursi: e.sisa_kursi,
            kapasitas_penumpang: e.kapasitas_penumpang
        });
        setTanggalKeberangkatan(e.tanggal_balik);
    }

    return (
        <BaseContainer>
            <CustomBreadcumb
                title="Edit Invoice"
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
                <div className="w-full h-auto mr-4 bg-white p-2 sm:p-8 rounded-xl">
                    <div className="text-md font-robotomedium mb-2">Jadwal Keberangkatan</div>
                    <div className="sm:grid gap-x-6 grid-cols-2">
                        <Input
                            label="Dermaga Asal"
                            value={tiket?.dermaga_awal}
                            placeholder=""
                            onChangeText={() => { }}
                            disabled
                        />
                        <Input
                            label="Dermaga Asal"
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
                        <Input
                            label="Waktu Keberangkatan"
                            value={tiket?.waktu_berangkat}
                            placeholder=""
                            onChangeText={() => { }}
                            disabled
                        />
                    </div>
                    <div className="mt-2 mb-4">
                        <Button 
                            label="Ubah Jadwal Keberangkatan"
                            outline
                            onClick={()=> setShowModalKeberangkatan(true)}
                        />
                    </div>
                    <CustomModal
                        modalIsOpen={showModalKeberangkatan}
                        closeModal={() => setShowModalKeberangkatan(false)}
                    >
                        <SearchTiketModal
                            rute={rute!}
                            close={() => setShowModalKeberangkatan(false)}
                            tglKebrangkatan={tanggalKeberangkatan}
                            waktuKeberangkatan={detail ? detail.detail_jadwal.waktu_berangkat : ''}
                            onJadwalSelect={(e) => onSelectJadwalKeberangkatan(e)}
                        />
                    </CustomModal>
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
                                    label="Dermaga Asal"
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
                                <Input
                                    label="Waktu Kembali"
                                    value={ppInfo.jamBalik}
                                    placeholder=""
                                    onChangeText={() => { }}
                                    disabled
                                />
                            </div>
                            <div className="mt-2 mb-4">
                                <Button 
                                    label="Ubah Jadwal Kembali"
                                    outline
                                    onClick={() => selectJenisPerjalanan('pulang_pergi')}
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
                {!loading ? 
                 <Tabs defaultIndex={rombongan.length > 1 ? 1 : 0}>
                    <TabList className={'flex'}>
                        <Tab disabled disabledClassName="text-slate-400" selectedClassName="bg-primary text-white" className={'border-primary border-2 flex h-[40px] items-center px-6 text-sm rounded-tl-lg rounded-bl-lg rounded-tr-none'}>Perorangan</Tab>
                        <Tab disabled disabledClassName="text-slate-400" selectedClassName="bg-primary text-white" className={'border-primary border-2 flex h-[40px] items-center px-6 text-sm rounded-tr-lg rounded-bl-none rounded-br-lg'}>Rombongan</Tab>
                    </TabList>
                    {/* Pribadi */}
                    <TabPanel>
                        {rombongan.map((item: any, index: number) => {
                            if (index > 0) return;
                            return (
                                <div className="mb-4" key={item.id}>
                                    <div className="sm:grid gap-x-6 grid-cols-2 mt-4">
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
                                            onChangeText={(e) => setRombongan(rombongan.map((itm: any, idx: number) => {
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
                                            onChangeText={(e) => setRombongan(rombongan.map((itm: any, idx: number) => {
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
                                            onChange={(e) => setRombongan(rombongan.map((itm: any, idx: number) => {
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
                                        onChangeText={(e) => setRombongan(rombongan.map((itm: any, idx: number) => {
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
                    </TabPanel>
                    {/* Rombongan */}
                    <TabPanel>
                        {rombongan.map((item: any, index: number) => {
                            return (
                                <div className="mb-4" key={item.id}>
                                    <NumberSeparator
                                        value={index + 1}
                                        onClick={() => hapusPenumpang(index)}
                                        enable={false}
                                    />
                                    <div className="sm:grid gap-x-6 grid-cols-2">
                                        <SelectBox
                                            label="Jenis Penumpang"
                                            placeholder="Pilih data"
                                            disable
                                            option={jenisPenumpang}
                                            value={item.jenisPenumpang}
                                            onChange={(e) => onJenisPenumpangChanged(e, index)}
                                            onValueHasChanged={onValueChanged}
                                        />
                                        <Input
                                            label="Nama Penumpang"
                                            placeholder="Masukkan nama penumpang"
                                            value={item.nama}
                                            disabled
                                            onChangeText={(e) => setRombongan(rombongan.map((itm: any, idx: number) => {
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
                                            disabled
                                            onChangeText={(e) => setRombongan(rombongan.map((itm: any, idx: number) => {
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
                                            disable
                                            value={item.jenisKelamin}
                                            onChange={(e) => setRombongan(rombongan.map((itm: any, idx: number) => {
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
                                        disabled
                                        value={item.email}
                                        onChangeText={(e) => setRombongan(rombongan.map((itm: any, idx: number) => {
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
                    </TabPanel>
                </Tabs>
                : null}
            </BaseCard>

            <div className="mt-4"></div>
            <BaseCard>
                <CheckBox
                    text="Tambahan Service"
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
                            label="Area Penjemputan"
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
                modalIsOpen={showModalPaket}
                closeModal={cancelPaket}
            >
                <PaketModal
                    close={cancelPaket}
                    onConfirm={confirmPaket}
                />
            </CustomModal>
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
        </BaseContainer>
    );
}