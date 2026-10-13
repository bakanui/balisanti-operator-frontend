'use client';
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { IAuth } from "../types/auth";
import axios from "axios";
import { getStorageValue } from "../utils/localstoreage";
import { API_PEMBAYARAN } from "../utils/api";
import AsyncSelect from 'react-select/async';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { useInvoiceDetail } from "@/hooks/invoice.hook";
import { useError } from "@/hooks/global.hook";

type InvoiceAction = 'edit' | 'cancel';

const parseDepartureDate = (tanggal?: string, waktu?: string) => {
    if (!tanggal || !waktu) return null;

    const [year, month, day] = tanggal.split('-').map(Number);
    const [hour = 0, minute = 0, second = 0] = waktu.split(':').map(Number);
    const result = new Date(year, month - 1, day, hour, minute, second);

    return Number.isNaN(result.getTime()) ? null : result;
};

export default function EditInvoice() {
    const router = useRouter();
    const [selectedInvoice, setSelectedInvoice] = useState<{ value: string; label: string } | null>(null);
    const [detail, getDetail, loadingDetail] = useInvoiceDetail({});
    const [menu, setMenu] = useState<InvoiceAction | null>(null);

    const searchInvoice = async(inputValue: string) => {
        const auth: IAuth = getStorageValue('auth');
        const res = await axios.get<any>(API_PEMBAYARAN.LIST_INVOICE_SUGGESTION,
            {
                headers: {
                    Authorization: `Bearer ${auth.authorisation.token}`,
                },
                params: {
                    search: inputValue,
                    limit: 30
                }
            });
        const {data} = await res;
        return data.data.map((item: string)=> ({
            value: item,
            label: item
        }));
    };

    const promiseOptions = (inputValue: string) =>
        new Promise<any[]>((resolve) => {
          setTimeout(() => {
            resolve(searchInvoice(inputValue));
          }, 1000);
    });

    useEffect(() => {
        if (!detail || !menu) return;

        if (!detail.penumpang || detail.penumpang.length === 0) {
            toast.error('Nomor invoice tidak ditemukan atau seluruh tiket telah dibatalkan.');
            return;
        }

        const jadwal = detail.detail_jadwal || {};
        const departureDate = parseDepartureDate(
            jadwal.tanggal_berangkat || detail.penumpang[0]?.tanggal,
            jadwal.waktu_berangkat || detail.penumpang[0]?.jam
        );

        if (!departureDate) {
            toast.error('Waktu keberangkatan invoice tidak valid. Periksa data jadwal terlebih dahulu.');
            return;
        }

        // Tidak ada toleransi tambahan: invoice hanya dapat diubah sebelum waktu
        // keberangkatan yang tercatat pada jadwal.
        if (departureDate.getTime() <= Date.now()) {
            toast.error('Kapal sudah berangkat. Invoice tidak dapat diedit!');
            return;
        }

        const invoice = detail.pembayaran?.no_invoice;
        if (!invoice) {
            toast.error('Nomor invoice tidak tersedia.');
            return;
        }

        router.push(
            menu === 'cancel'
                ? '/edit-invoice/edit?invoice=' + invoice
                : '/edit-invoice/edit/invoice?invoice=' + invoice
        );
    }, [detail, menu, router]);

    useEffect(() => {
        document.title = "Edit Invoice | SIPELARANG";
    }, [])

    const getDataInvoice = (action: InvoiceAction) => {
        if(!selectedInvoice?.value) {
            toast.error('Pilih data invoice terlebih dahulu!');
            return;
        }
        setMenu(action);
        const tmp = selectedInvoice.value.split('/')[0];
        getDetail(tmp);
    }

    return(
        <BaseContainer>
            <CustomBreadcumb title="Edit Invoice" noRoute/>
            <BaseCard>
                <div className="font-roboto text-sm mb-2">Kode Invoice / Nama Pemesan</div>
                <AsyncSelect
                    cacheOptions
                    loadOptions={promiseOptions}
                    defaultOptions
                    onChange={(option) => setSelectedInvoice(option)}
                    placeholder="Masukkan kode invoice atau nama pemesan"
                    classNames={{
                        control: () => 'text-input text-sm font-robotoregular mb-4 cursor-pointer dark:bg-[#3b3b3b] text-white',
                        option: () => 'dark:text-black',
                        input: ()=> 'dark:text-white',
                        singleValue: () => 'dark:text-white',
                    }}
                />
                <div className="flex">
                    <Button label="Edit Invoice" outline onClick={() => getDataInvoice('edit')}/>
                    <span className="ml-2"/>
                    <Button label="Cancel Penumpang" onClick={() => getDataInvoice('cancel')}/>
                </div>
            </BaseCard>
            <LoadingOverlay
                loading={loadingDetail}
                title="Memuat Data"
            />
            <ToastContainer/>
        </BaseContainer>
    )
}
