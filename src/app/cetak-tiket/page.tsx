'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { useCallback, useEffect, useRef, useState } from "react";
import ComponentToPrint, { IServiceOption } from "./components/tiketTemplate";
import { IPenumpang } from "../types/jadwal";
import { getInvoiceDetailAction } from "../pembayaran-agen/pembayaran.service";
import { toast, ToastContainer } from "react-toastify";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { IPenumpangOption, PenumpangListKeberangkatan } from "../pembayaran-agen/components/PenumpangListKeberangkatan";
import { convertLabelToPrice, parseDateIncludeHours, toastErrorConfig } from "@/app/utils/utility";
import { toPng } from 'html-to-image';
import Collapsible from 'react-collapsible';
import { Badge } from "../components/Badge";
import { IAuth } from "../types/auth";
import { getStorageValue } from "../utils/localstoreage";
import axios from "axios";
import { API_PEMBAYARAN } from "../utils/api";
import AsyncSelect from 'react-select/async';
import { IHargaService } from "../types/hargaService";
import { BarangListKeberangkatan } from "../pembayaran-agen/components/BarangListKeberangkatan";

interface IInvoiceOption {
    value: string;
    label: string;
}

export default function Operator() {
    const router = useRouter();
    const componentRef: any = useRef();
    const [agen, setAgen] = useState<any>(null);
    const [penumpang, setPenumpang] = useState<IPenumpangOption[]>([]);
    const [barang, setBarang] = useState<IServiceOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [checkAll, setCheckAll] = useState(true);
    const [checkAllBarang, setCheckAllBarang] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<IInvoiceOption | null>(null);
    const [invoiceOptions, setInvoiceOptions] = useState<IInvoiceOption[]>([]);
    const [pembayaran, setPembayaran] = useState({
        sisa_tagihan: 0,
        sudah_bayar: 0,
        total_tagihan: 0,
        status_lunas: ''
    });
    const [collect, setCollect] = useState('');

    const back = () => {
        router.back();
    }

    useEffect(() => {
        document.title = "Cetak Tiket | SIPELARANG";
    }, [])

    // set penumpang as global variable, can access through window
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // add key nama_agen and collect to penumpang
            const tmp = penumpang.map((item) => {
                return {
                    ...item,
                    nama_agen: agen?.nama_agen,
                    collect: collect
                }
            });
            (window as any).printTicket = JSON.stringify(tmp);
        }
    }, [penumpang])

    // set nama agen as global variable, can access through window
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).nama_agen = JSON.stringify(agen?.nama_agen);
        }
    }, [agen]);

    const onButtonClick = useCallback(() => {
        if (componentRef.current === null) {
            return
        }
        const divs = componentRef.current.querySelectorAll(':scope > div');
        var iteration = 1;
        divs.forEach((item: any, index: any) => {
            setTimeout(() => {
                toPng(item, { cacheBust: true, quality: 0.2})
                    .then((dataUrl) => {
                        console.log('kirim ke rawbt: ' + iteration++);
                        // send to rawbt
                        const link = document.createElement('a');
                        link.href = 'rawbt:' + dataUrl;
                        link.click();
                        link.remove();
                    })
                    .catch((err) => {
                        toast.error(err.message);
                    });
            },3000*index);
        });
    }, [componentRef])

    const tiketDispenser = () => {
        if (!componentRef.current) {
            toast.error('Preview tiket belum tersedia.', toastErrorConfig);
            return;
        }

        const tiketTerpilih = Array.from(
            componentRef.current.querySelectorAll(':scope > div')
        ) as HTMLElement[];
        if (tiketTerpilih.length === 0) {
            toast.error('Pilih minimal satu tiket yang ingin dicetak.', toastErrorConfig);
            return;
        }

        const printWindow = window.open('', '_blank', 'width=450,height=800');
        if (!printWindow) {
            toast.error('Browser memblokir jendela cetak. Izinkan pop-up lalu coba lagi.', toastErrorConfig);
            return;
        }

        const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
            .map((element) => element.outerHTML)
            .join('');
        const tickets = Array.from(tiketTerpilih)
            .map((ticket) => `<section class="ticket-print">${ticket.outerHTML}</section>`)
            .join('');

        printWindow.document.write(`
            <!doctype html>
            <html>
                <head>
                    <title>Cetak Tiket</title>
                    ${styles}
                    <style>
                        body { margin: 0; background: #fff; }
                        .ticket-print { width: 400px; margin: 0 auto; page-break-after: always; break-after: page; }
                        .ticket-print:last-child { page-break-after: auto; break-after: auto; }
                    </style>
                </head>
                <body>${tickets}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };

    const getData = () => {
        if (!selectedInvoice?.value) {
            toast.error('Pilih nomor invoice terlebih dahulu.', toastErrorConfig);
            return;
        }
        setLoading(true);
        getInvoiceDetailAction(
            selectedInvoice.value,
            (data) => {
                if (!data.penumpang || data.penumpang.length === 0) {
                    setPenumpang([]);
                    setBarang([]);
                    setLoading(false);
                    toast.error('Invoice tidak ditemukan atau seluruh tiketnya telah dibatalkan.', toastErrorConfig);
                    return;
                }
                const tempPenumpang = data.penumpang;
                const tempBarang = data.service;
                const agen = data.agen;
                setAgen(agen);
                setPenumpang(tempPenumpang.map((item: IPenumpang) => ({
                    ...item,
                    selected: true
                })));
                setBarang(tempBarang.map((item: IHargaService) => ({
                    ...item,
                    selected: true
                })));
                setCheckAll(true);
                setCheckAllBarang(true);
                setPembayaran({
                    sisa_tagihan: data.pembayaran.sisa_tagihan,
                    sudah_bayar: data.pembayaran.sudah_bayar,
                    total_tagihan: data.pembayaran.total_tagihan,
                    status_lunas:  data.pembayaran.status_lunas
                });
                if(data.collect){
                    setCollect(data.collect.jumlah);
                } else {
                    setCollect('');
                }
                setLoading(false);
            },
            (error) => {
                setLoading(false);
                toast.error(error || 'Gagal mengambil detail invoice.', toastErrorConfig);
            },
            () => {
                router.replace('/login');
            }
        );
    }

    const selectPenumpang = (index: number) => {
        const tmp = penumpang.map((item, idx) => {
            if (index == idx) {
                return {
                    ...item,
                    selected: !item.selected
                }
            }
            return item;
        })
        setPenumpang(tmp);
    }

    const onCheckAll = () => {
        setCheckAll(!checkAll);
        const tmp = penumpang.map((item) => {
            return {
                ...item,
                selected: !checkAll
            };
        })
        setPenumpang(tmp);  
    }

    const selectBarang = (index: number) => {
        const tmp = barang.map((item, idx) => {
            if (index == idx) {
                return {
                    ...item,
                    selected: !item.selected
                }
            }
            return item;
        })
        setBarang(tmp);
    }

    const onCheckAllBarang = () => {
        setCheckAllBarang(!checkAllBarang);
        const tmp2 = barang.map((item) => {
            return {
                ...item,
                selected: !checkAllBarang
            };
        })
        setBarang(tmp2);      
    }

    const searchInvoice = useCallback(async(inputValue: string): Promise<IInvoiceOption[]> => {
        const auth: IAuth = getStorageValue('auth');
        if (!auth?.authorisation?.token) {
            return [];
        }

        try {
            const res = await axios.get<any>(API_PEMBAYARAN.LIST_INVOICE_SUGGESTION, {
                headers: {
                    Authorization: `Bearer ${auth.authorisation.token}`,
                },
                params: {
                    search: inputValue,
                    limit: 30
                }
            });
            const {data} = res;
            return data.data.map((item: string) => {
                const separatorIndex = item.indexOf('/');
                const invoice = separatorIndex >= 0 ? item.slice(0, separatorIndex) : item;
                const namaPemesan = separatorIndex >= 0 ? item.slice(separatorIndex + 1) : '';

                return {
                    value: invoice,
                    label: namaPemesan ? `${invoice} — ${namaPemesan}` : invoice
                };
            });
        } catch (error) {
            toast.error('Gagal mengambil daftar invoice.', toastErrorConfig);
            return [];
        }
    }, []);

    useEffect(() => {
        searchInvoice('').then(setInvoiceOptions);
    }, [searchInvoice]);

    const handleInvoiceChange = (option: IInvoiceOption | null) => {
        setSelectedInvoice(option);
        setPenumpang([]);
        setBarang([]);
        setAgen(null);
        setCollect('');
        setCheckAll(true);
        setCheckAllBarang(true);
    };


    return (
        <BaseContainer>
            <CustomBreadcumb title="Cetak Tiket" noRoute />
            <BaseCard>
                <div className="font-robotomedium mb-2 text-sm">Kode Pemesanan / Nama Pemesan</div>
                <AsyncSelect
                    cacheOptions
                    defaultOptions={invoiceOptions}
                    loadOptions={searchInvoice}
                    value={selectedInvoice}
                    onChange={handleInvoiceChange}
                    isClearable
                    loadingMessage={() => 'Memuat invoice...'}
                    noOptionsMessage={() => 'Invoice tidak ditemukan'}
                    placeholder="Pilih invoice atau ketik nama pemesan"
                    classNames={{
                        control: () => 'text-input text-sm font-robotoregular mb-4 cursor-pointer dark:bg-[#3b3b3b] text-white',
                        option: () => 'dark:text-blacks',
                        input: ()=> 'dark:text-white',
                        singleValue: () => 'dark:text-white',
                    }}
                />
                <Button
                    label="Cari Data"
                    onClick={getData}
                />
                <div className="mt-4" />
                {!loading && penumpang.length > 0 ?
                    <>
                        <div className="flex items-center mb-2">
                            <div className="text-lg font-robotobold mr-4">Status Pembayaran</div>
                            <div className="h-{30px}">
                            <Badge
                                text={pembayaran.status_lunas == 'Lunas' ? 'Lunas' : 'Belum Lunas'}
                                status={pembayaran.status_lunas == 'Lunas'}
                            />
                            </div>
                        </div>
                        <PenumpangListKeberangkatan
                            penumpang={penumpang}
                            title="Penumpang"
                            selectPenumpang={selectPenumpang}
                            checkAll={checkAll}
                            setCheckAll={onCheckAll}
                        />
                        <BarangListKeberangkatan
                            penumpang={barang}
                            title="Barang"
                            selectPenumpang={selectBarang}
                            checkAll={checkAllBarang}
                            setCheckAll={onCheckAllBarang}
                        />
                        <div className="mt-6 mb-5">
                            <Button
                                label="Cetak Tiket"
                                outline
                                onClick={tiketDispenser}
                            />
                        </div>
                        <div className="flex bg-[red[">
                            <Collapsible 
                            trigger="Preview Tiket"
                            className="bg-primarys w-full mt-3"
                            triggerClassName="bg-primary text-[white] p-2 rounded-[8px]"
                            triggerOpenedClassName="bg-primary text-[white] p-2 rounded-[8px]"
                            >
                                <div className="w-[420px] border-2 mt-4">
                                    <ComponentToPrint ref={componentRef} collect={collect} service={barang} penumpang={penumpang} agen={agen}/>
                                </div>
                            </Collapsible>
                        </div>
                    </>
                    : null}
            </BaseCard>
            <LoadingOverlay
                loading={loading}
                title="Memuat Data"
            />
            <ToastContainer />
        </BaseContainer>
    );
}
