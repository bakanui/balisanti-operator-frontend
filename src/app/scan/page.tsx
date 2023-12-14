'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "../components/Input";
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useState } from "react";
import { convertLabelToPrice, parseDateIncludeHours, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { scanTiketAction } from "./scan.service";
import { toast, ToastContainer } from "react-toastify";
import { Alert } from "../components/Alert";
import { LoadingOverlay } from "../components/LoadingOverlay";

export default function Operator(){
    const [loading, setLoading] = useState(false);
    const [kode, setKode] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');

    const onScanned = (result: string) => {
        if(loading || showAlert) {
            return;
        }
        setLoading(true);
        scanTiketAction(
            {
                kode_booking: result
            },
            (data)=> {
                setMessageAlert(data.message);
                toast.success(data.message, toastSuccessConfig);
                setKode('');
                setLoading(false);
                setShowAlert(true);
            },
            (err)=> {
                toast.error(err);
            }
        );
    }

    const onError = (error: Error) => {
        console.log(error);
    }

    const boarding = () => {
        setLoading(true);
        scanTiketAction(
            {
                kode_booking: kode
            },
            (data)=> {
                setMessageAlert(data.message);
                toast.success(data.message, toastSuccessConfig);
                setKode('');
                setLoading(false);
            },
            (err)=> {
                toast.error(err);
            }
        );
    }
   
    return(
        <BaseContainer>
            <CustomBreadcumb title="Scan Tiket" noRoute/>
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
            <Alert
                title="Scan Tiket"
                content={messageAlert}
                confirmText="Oke"
                cancelText="Tutup"
                isOpen={showAlert}
                closeAlert={()=>setShowAlert(false)}
                confirmAlert={()=>setShowAlert(false)}
            />
            <LoadingOverlay
                loading={loading}
                title="Mohon Tunggu..."
            />
            <ToastContainer />
        </BaseContainer>
    );
}