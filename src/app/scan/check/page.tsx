'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "../../components/Input";
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { convertLabelToPrice, parseDateIncludeHours, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { scanTiketAction } from "../scan.service";
import { toast, ToastContainer } from "react-toastify";
import { Alert } from "../../components/Alert";
import { IPenumpang } from "../../types/jadwal";
import { AlertChecker } from "../../components/AlertChecker";
import { LoadingOverlay } from "../../components/LoadingOverlay";
import { IPenumpangOption, PenumpangListKeberangkatan } from "../../pembayaran-agen/components/PenumpangListKeberangkatan";
import { removeStorage, getStorageValue, setStorageValue } from "../../utils/localstoreage";

export default function OperatorCheck(){
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [kode, setKode] = useState('');
    const [penumpang, setPenumpang] = useState<IPenumpangOption[]>([]);
    const [invoice, setInvoice] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showAlert2, setShowAlert2] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    let time = getStorageValue('tiket');

    const onScanned = (result: string) => {
        setLoading(true);
        scanTiketAction(
            {
                kode_booking: result,
                waktu_keberangkatan: time.waktu_berangkat
            },
            (data)=> {
                // setMessageAlert(data.message);
                toast.success(data.message, toastSuccessConfig);
                setKode('');
                setLoading(false);
                setShowAlert(false);
            },
            (err)=> {
                if (err.penumpang) {
                    const tempPenumpang = err.penumpang;
                    setPenumpang(tempPenumpang.map((item: IPenumpang) => ({
                        ...item,
                        selected: true
                    })));  
                    setShowAlert(true);
                }
                toast.error(err.message);
                setLoading(false);
            }
        );
    }

    const onScannedHelper = (result: string) => {
        setKode(result);
        setShowAlert2(true);
    }

    const onError = (error: Error) => {
        console.log(error);
    }

    const checkBoard = () => {
        setShowAlert(true);

    }

    const boarding = () => {
        setMessageAlert("Check-in sekarang?")
        setLoading(true);
        scanTiketAction(
            {
                kode_booking: kode,
                waktu_keberangkatan: time
            },
            (data)=> {
                // setMessageAlert(data.message);
                toast.success(data.message, toastSuccessConfig);
                setKode('');
                setLoading(false);
                setShowAlert(false);
                // setShowAlert2(false);
            },
            (err)=> {
                console.log(err.response.data)
                if (err.response.data.penumpang) {
                    const tempPenumpang = [];
                    tempPenumpang.push(err.response.data.penumpang);
                    setPenumpang(tempPenumpang.map((item: IPenumpang) => ({
                        ...item,
                        selected: true
                    })));
                    setShowAlert(true);
                }
                toast.error(err);
                setLoading(false);
            }
        );
    }
   
    const back = () => {
        removeStorage('jamKeberangkatan');
        router.back();
    }
    return(
        <BaseContainer>
            <CustomBreadcumb title={"Scan Tiket Keberangkatan " + time.waktu_berangkat} onBack={back}/>
            <BaseCard>
                <div className="p-2 sm:flex sm:flex-row h-fit">
                    <div className="sm:h-[400px] sm:w-[400px] sm:flex sm:items-center">
                        <QrScanner
                            onDecode={onScanned}
                            onError={onError}
                            containerStyle={{borderRadius: 12}}
                        />
                    </div>
                    
                    <div className="sm:mt-2 flex items-center sm:hidden">
                        <div className="w-full">
                            <hr className=""/>
                        </div>
                        <div className=" w-fit bg-white p-2 font-robotoregular text-sm">atau</div>
                        <div className="w-full">
                            <hr className=""/>
                        </div>
                    </div>

                    <div className="invisible sm:visible flex flex-col px-4">
                        <div className="h-full flex justify-center">
                            <div className="w-[1px] h-full bg-slate-300"/>
                        </div>
                        <div className="w-fit bg-white p-2 font-robotoregular text-sm">atau</div>
                        <div className="h-full flex justify-center">
                            <div className="w-[1px] h-full bg-slate-300"/>
                        </div>
                    </div>

                    <div className="sm:flex sm:flex-col w-full sm:justify-center">
                        <div className="flex justify-center sm:justify-start font-robotomedium text-md">Kode Tiket</div>
                        <Input 
                            label=""
                            value={kode}
                            placeholder="Masukkan kode tiket"
                            onChangeText={(e)=>setKode(e.target.value)}
                        />
                    </div>
                    
                </div>
            </BaseCard>
            <div className="flex sm:justify-end">
                <div className="flex mt-6 w-full sm:w-[30%]">
                    <Button 
                        outline
                        label="Batal"
                    />
                    <div className="ml-3"/>
                    <Button 
                        label="Boarding"
                        onClick={boarding}
                    />
                </div>
            </div>
            {/* <Alert
                title="Scan Tiket"
                content="Check-in sekarang?"
                confirmText="   Ya   "
                cancelText="  Reschedule  "
                isOpen={showAlert}
                closeAlert={() => router.push('/edit-invoice/edit/invoice?invoice=INV-'+kode.substring(0, 10))}
                confirmAlert={boarding}
            /> */}
            <AlertChecker
                isOpen={showAlert}
                closeAlert={() => setShowAlert(false)}
                penumpang={penumpang}
            />
            <LoadingOverlay
                loading={loading}
                title="Mohon Tunggu..."
            />
            <ToastContainer />
        </BaseContainer>
    );
}