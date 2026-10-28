import { IOptions } from "@/app/types/auth";
import { IOpsiPenumpang } from "@/app/types/penumpang";
import { useEffect, useState } from "react";
import { getOpsiPenumpangAction } from "../penumpang.service";

const toOptions = (data: IOpsiPenumpang[]): IOptions[] => data.map((item)=> ({value: item.nama, label: item.nama}));

// Opsi tipe & jenis penumpang untuk form tambah/edit, diambil dari master opsi penumpang.
export const useOpsiPenumpang = () => {
    const [tipeOptions, setTipeOptions] = useState<IOptions[]>([]);
    const [jenisOptions, setJenisOptions] = useState<IOptions[]>([]);

    useEffect(()=>{
        getOpsiPenumpangAction({kategori: 'tipe'}, (res)=>setTipeOptions(toOptions(res.data)), ()=>{});
        getOpsiPenumpangAction({kategori: 'jenis'}, (res)=>setJenisOptions(toOptions(res.data)), ()=>{});
    },[]);

    return { tipeOptions, jenisOptions };
}
