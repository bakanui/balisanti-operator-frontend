"use client"
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TextBetweenLabel } from "../components/TextBetweenLabel";
import { SelectBox } from "@/app/components/SelectBox";
import { METODE_PEMBAYARAN } from "@/app/constants/metodePembayaran";
import { PriceInput } from "@/app/components/PriceInput";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { FilePicker } from "@/app/components/FilePicker";
import { getStorageValue } from "@/app/utils/localstoreage";
import { convertLabelPriceToNumeberPrice, convertLabelToPrice, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { IOptions } from "@/app/types/auth";
import { toast, ToastContainer } from "react-toastify";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { createPembayaranAction } from "../pembayaran.service";

export default function Pembayaran() {
  const router = useRouter();
  const queryParams: any = useSearchParams();
  const [pembayaran, setPembayaran] = useState({
    sisa_tagihan: 0,
    sudah_bayar: 0,
    total_tagihan: 0
  });
  const [metodePembayaran, setMetodePembayaran] = useState<IOptions>({value: '', label: 'Pilih Data'});
  const [nominalBayar, setNominalBayar] = useState<any>('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const tagihan = getStorageValue('tagihan');
    if (tagihan) {
      setPembayaran(tagihan);
    }
  },[]);

  const back = () => {
    router.back();
  }

  const save = () => {
    setLoading(true);
    let data = {};
    if (file) {
      data = {
        no_invoice: queryParams.get('invoice'),
        metode_bayar: metodePembayaran.value,
        nominal: convertLabelPriceToNumeberPrice(nominalBayar),
        bukti_bayar: file
      }
    } else {
      data = {
        no_invoice: queryParams.get('invoice'),
        metode_bayar: metodePembayaran.value,
        nominal: convertLabelPriceToNumeberPrice(nominalBayar)
      }
    }
    
    createPembayaranAction(
        data,
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
        }
    );
  }

  const pickFile = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setFile(i);
    }
  }

  return(
    <BaseContainer>
        <CustomBreadcumb onBack={back} title="Pembayaran Invoice"/>
        <div className="my-4 relative flex justify-between">
          <div className="w-full h-auto mr-4 bg-white p-2 sm:p-8 rounded-xl">
            <SelectBox
                label="Metode Pembayaran"
                placeholder="Pilih data"
                option={METODE_PEMBAYARAN}
                onChange={setMetodePembayaran}
            />
            <PriceInput 
              label="Total yang Dibayarkan"
              placeholder="200.000"
              disabled={false}
              value={nominalBayar}
              onChangeText={(text)=>setNominalBayar(text)}
            />
            <FilePicker 
              label="Upload Bukti Pembayaran"
              onClick={pickFile}
            />
          </div>
          <div className="min-w-[250px]">
              <div className="w-full h-auto mr-4 bg-white p-2 sm:p-8 rounded-xl">
                  <div className="text-lg font-robotobold mr-4 mb-3">Tagihan</div>
                  <TextBetweenLabel 
                    title="Total Tagihan"
                    prefix="Rp."
                    sufix={convertLabelToPrice(`${pembayaran.total_tagihan}`)}
                  />
                  <div className="mb-3"/>
                  <TextBetweenLabel 
                    title="Sudah Dibayarkan"
                    prefix="Rp."
                    sufix={convertLabelToPrice(`${pembayaran.sudah_bayar}`)}
                  />
                  <div className="mb-3"/>
                  <TextBetweenLabel 
                    title="Terhutang"
                    prefix="Rp."
                    sufix={convertLabelToPrice(`${pembayaran.sisa_tagihan}`)}
                  />
              </div>
          </div>
        </div>
        <ButtonGroup
            onCancel={back}
            onConfirm={save}
        />
        <ToastContainer />
        <LoadingOverlay 
          title="Menyimpan Data"
          loading={loading}
        />
    </BaseContainer>
  );
}
