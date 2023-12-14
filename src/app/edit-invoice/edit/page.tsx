'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { BaseContainer } from "@/app/components/Container";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { getInvoiceDetailAction } from "@/app/pembayaran-agen/pembayaran.service";
import { IPenumpang } from "@/app/types/jadwal";
import { BaseCard } from "@/app/components/BaseCard";
import { Input } from "@/app/components/Input";
import { HeadTb, TableRow } from "@/app/components/MyTable";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { Alert } from "@/app/components/Alert";
import { IAgen } from "@/app/types/agen";
import { IOptions } from "@/app/types/auth";
import { getAgenAction } from "@/app/master-data/agen/agen.service";
import { IPenumpangOption } from "@/app/pembayaran-agen/components/PenumpangListKeberangkatan";
import { useCancelPassanger } from "@/hooks/invoice.hook";
import { Empty } from "@/app/components/Empty";

export default function EditInvoice(){
    const router = useRouter();
    const queryParams: any = useSearchParams();
    const [invoice, setInvoice] = useState('');
    const [loading, setLoading] = useState(false);
    const [penumpang, setPenumpang] = useState<IPenumpangOption[]>([]);
    const [agen, setAgen] = useState<IOptions[]>([]);
    const [selectedAgen, setSelectedAgen] = useState({ value: '0', label: 'Tanpa Agen' });
    const [cancelTmp, setCancelTmp] = useState<IPenumpang | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [onCancel, loadingCancel] = useCancelPassanger();

    useEffect(()=> {
        setInvoice(queryParams.get('invoice'))
        detailInvoice();
    }, []);

    const detailInvoice = () => {
        setLoading(true);
        getInvoiceDetailAction(
            queryParams.get('invoice'),
            (data) => {
                if(data.pembayaran.sudah_bayar == 1){
                    toast.error('Invoice sudah dibayar. Tidak dapat diedit!');
                    setLoading(false);
                    return;
                }
                setPenumpang(() => {
                    return data.penumpang.map((item: IPenumpang) => ({
                        ...item,
                        pembayaran: "cash",
                        selected: true
                    }))
                });
                if(data.agen !== null){
                    setSelectedAgen({
                        value: data.agen.id,
                        label: data.agen.nama_agen
                    });
                }
                setLoading(false);
            },
            () => {
                setLoading(false);
            }
        );
    }

    useEffect(()=>{
        getAgenAction(
        {
            limit: 100,
            status: 1
        },
        (data) => {
            setAgen((prev) => {
                return prev.concat({
                    value: '0',
                    label: 'Tanpa Agen'
                })
            });
            const tmpAgen = data.data.map((item: IAgen) => ({
                value: item.id,
                label: item.nama_agen
            }));
            setAgen((prev) => {
                return prev.concat(tmpAgen);
            });

            
        },
        (err) => {
            setLoading(false);
            toast.error(err.message);
        }
    );
    }, []);
    
    const back = () => {
        router.back();
    }

    const selectCancelPassanger = (data: any) => {
        setCancelTmp(data);
        setShowAlert(true);
    }

    const cancelPassanger = () => {
        setShowAlert(false);
        if (cancelTmp) {
            onCancel(cancelTmp, ()=> {
                detailInvoice();
            });   
        }
    }
    
    return (
        <>
            <BaseContainer>
                <CustomBreadcumb 
                title={'Edit Invoice'} 
                onBack={back}
                />
                <BaseCard>
                    <Input
                        label="Nomor Invoice"
                        value={invoice}
                        disabled={true}
                        placeholder="Masukkan Nomor Invoice"
                        onChangeText={() => { }}
                    />
                    <Input
                        label="Agen"
                        value={selectedAgen.label}
                        disabled={true}
                        placeholder="Agen"
                        onChangeText={() => { }}
                    />
                    <span className="font-robotomedium text-sm">Penumpang</span>
                    <table className="mt-2 border-collapse w-full p-8 my-4 text-left" id="table-penumpang">
                        <HeadTb>
                            <tr>
                                <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                                <th className="text-sm font-robotomedium py-2">Kode Booking</th>
                                <th className="text-sm font-robotomedium py-2">Nama</th>
                                <th className="text-sm font-robotomedium py-2">No. Identitas</th>
                                <th className="text-sm font-robotomedium py-2">Jenis Kelamin</th>
                                <th className="text-sm font-robotomedium py-2">Email</th>
                                <th className="text-sm font-robotomedium py-2 text-center">Aksi</th>
                            </tr>
                        </HeadTb>
                        <tbody>
                            {penumpang.map((item, index)=> {
                                if(item.selected == false){
                                    return;
                                }
                                return(
                                    <TableRow key={index} strip={index%2 == 1}>
                                        <td className="pl-4 py-2">{index+1}</td>
                                        <td className="py-2">{item.kode_booking}</td>
                                        <td className="py-2">{item.nama_penumpang}</td>
                                        <td className="py-2">{item.no_identitas}</td>
                                        <td className="py-2">{item.jenis_kelamin == 'l' ? 'Laki-laki' : 'Perempuan'}</td>
                                        <td className="py-2">{item.email}</td>
                                        <td className="text-center py-2">
                                            <button 
                                            onClick={()=> selectCancelPassanger(item)}
                                            className="h-[28px] px-5 text-xs rounded-full font-robotoregular border-solid border-2 border-red-600 hover:bg-red-600 hover:text-white">
                                                Cancel</button>
                                        </td>
                                    </TableRow>
                                );
                            })}
                            <tr className="border border-[black] border-x-0">
                            </tr>
                        </tbody>
                    </table>
                    {!loading && penumpang.length == 0 ? 
                        <Empty 
                            title="Tidak ada penumpang"
                            subtitle="Kemungkin semua penumpang telah dicancel"
                        />
                    : null}
                    <Alert
                        title="Cancel Keberangkatan"
                        content={`Apakah Anda yakin membatalkan ${cancelTmp ? cancelTmp.nama_penumpang : '-'} (${cancelTmp ? cancelTmp.kode_booking : '-'})?`}
                        isOpen={showAlert}
                        closeAlert={()=> setShowAlert(!showAlert)}
                        confirmAlert={cancelPassanger}
                        confirmText='Ya'
                        cancelText='Tidak'
                    />
                </BaseCard>
                <LoadingOverlay loading={loadingCancel || loading} title="Memuat data..." />
                <ToastContainer/>
            </BaseContainer>
        </>
    )
}