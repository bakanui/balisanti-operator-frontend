import { Button } from "@/app/components/Button";
import { DatePicker } from "@/app/components/DatePicker";
import { SelectBox } from "@/app/components/SelectBox";
import { getDermagaAction } from "@/app/master-data/dermaga/dermaga.service";
import { IOptions } from "@/app/types/auth";
import { IDermaga } from "@/app/types/dermaga";
import { IPenjualanTiket } from "@/app/types/jadwal";
import { IRute } from "@/app/types/rute";
import { parseDateToBackendFormat, timeList, toastErrorConfig } from "@/app/utils/utility";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Loading } from "@/app/components/Loading";
import { TiketCard } from "./TiketCard";
import { CustomPagination } from "@/app/components/CustomPagination";
import { Empty } from "@/app/components/Empty";
import { getPenjualanAction } from "../penjualanTiket.service";
import { toast, ToastContainer } from "react-toastify";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { Input } from "@/app/components/Input";

interface IProps {
    onConfirm: (text: string) => void;
    close: () => void;
}
export const PaketModal = (props: IProps) => {
    const [jumlah, setJumlah] = useState('');

    const simpan = () => {
        if (!jumlah) {
            toast.error('Silakan isikan jumlah terlebih dahulu!');
            return;
        }
        props.onConfirm(jumlah);
    }

    return(
        <div className="w-[50vw] p-2">
            <div onClick={props.close} className='h-[24px] w-[24px] rounded-full flex justify-center items-center bg-primary absolute right-2 top-2 cursor-pointer'>
                <FontAwesomeIcon className='text-white' icon={faClose}/>
            </div>
            <div className="font-robotobold text-lg mb-4">Konfirmasi Paket</div>
            <Input
                label="Jumlah Paket"
                placeholder="contoh: 5"
                type='number'
                value={jumlah}
                onChangeText={(e)=>setJumlah(e.target.value)}
            />
            <ButtonGroup
                onCancel={props.close}
                onConfirm={simpan}
                confirmText="Simpan"
                cancelText="Batalkan"
            />
        </div>
    );
}