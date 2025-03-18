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

export default function EditInvoice() {
    const router = useRouter();
    const [selectedInvoice, setSelectedInvoice] = useState({value: '', label: 'Pilih Data'});
    const [detail, getDetail, loadingDetail] = useInvoiceDetail({});
    const [menu, setMenu] = useState("");

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
        console.log('useEffect triggered with detail:', detail);

        if (detail) {
            let berangkat = detail.detail_jadwal.tanggal_berangkat + ' ' + detail.detail_jadwal.waktu_berangkat;
            let berangkatDate = new Date(berangkat);
            let leewayDate = new Date(berangkatDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours    
            console.log(berangkat)
            console.log(berangkatDate)
            console.log(leewayDate)
            if (detail.length == 0) {
                toast.error('Nomor Invoice Tidak Ditemukan!');
                return;
            }
            // if (detail.pembayaran.status_lunas == "Belum Lunas") {
            //     console.log('Invoice already paid');
            //     toast.error('Invoice sudah dibayar. Tidak dapat diedit!');
            //     return;
            // }
            if (leewayDate < new Date()) {
                toast.error('Kapal sudah berangkat. Tidak dapat diedit!');
            }else if (menu == "cancel") {
                router.push('/edit-invoice/edit?invoice=' + detail.pembayaran.no_invoice);
            }else if (menu == "edit") {
                let tmp = selectedInvoice.value.split('/')[0];
                router.push('/edit-invoice/edit/invoice?invoice='+tmp);
            }
        }
    }, [detail]);

    useEffect(() => {
        document.title = "Edit Invoice | SIPELARANG";
    }, [])

    const getDataInvoice = async () => {
        if(!selectedInvoice.value) {
            toast.error('Pilih data invoice terlebih dahulu!');
            return;
        }
        const tmp = selectedInvoice.value.split('/')[0];
        getDetail(tmp);
    }

    const editCoreInvoice = () => {
        if(!selectedInvoice.value) {
            toast.error('Pilih data invoice terlebih dahulu!');
            return;
        }
        const tmp = selectedInvoice.value.split('/')[0];
        router.push('/edit-invoice/edit/invoice?invoice='+tmp);
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
                    onChange={setSelectedInvoice}
                    placeholder="Masukkan kode invoice atau nama pemesan"
                    classNames={{
                        control: () => 'text-input text-sm font-robotoregular mb-4 cursor-pointer dark:bg-[#3b3b3b] text-white',
                        option: () => 'dark:text-black',
                        input: ()=> 'dark:text-white',
                        singleValue: () => 'dark:text-white',
                    }}
                />
                <div className="flex">
                    <Button label="Edit Invoice" outline onClick={()=> {setMenu("edit"); getDataInvoice()}}/>
                    <span className="ml-2"/>
                    <Button label="Cancel Penumpang" onClick={()=> {setMenu("cancel"); getDataInvoice()}}/>
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