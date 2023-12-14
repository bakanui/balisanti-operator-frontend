'use client'
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AsyncSelect from 'react-select/async';
import axios from "axios";
import { API_PEMBAYARAN } from "../utils/api";
import { IAuth } from "../types/auth";
import { getStorageValue } from "../utils/localstoreage";

export default function Operator(){
    const router = useRouter();
    const [selectedInvoice, setSelectedInvoice] = useState({value: '', label: 'Pilih Data'});

    const gotoSearch = () => {
        if (!selectedInvoice.value) {
            toast.error('Pastikan Anda telah menginput Nomor Invoice!');
            return;
        }
        router.push('/pembayaran-agen/detail-invoice?id='+selectedInvoice.value);
    }

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

    return(
        <BaseContainer>
            <CustomBreadcumb title="Pembayaran" noRoute/>
            <div className="my-4 relative flex justify-between">
               <div className="w-full h-auto mr-4 bg-white p-2 sm:p-8 rounded-xl">
                    <div className="">
                        <div className="font-robotomedium mb-2 text-sm">Kode Pemesanan</div>
                        <AsyncSelect 
                            cacheOptions 
                            loadOptions={promiseOptions} 
                            defaultOptions 
                            onChange={setSelectedInvoice}
                            placeholder="Ketik kode pemesanan di sini"
                            classNames={{
                                control: () => 'text-input text-sm font-robotoregular mb-4 cursor-pointer dark:bg-[#3b3b3b] text-white',
                                option: () => 'dark:text-black',
                                input: ()=> 'dark:text-white',
                                singleValue: () => 'dark:text-white',
                            }}
                        />
                        <Button 
                            label="Cari Data"
                            onClick={gotoSearch}
                        />
                    </div>
               </div>
           </div>
           <div className="mt-4"></div>
           <ToastContainer />
        </BaseContainer>
    );
}