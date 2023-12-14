'use client';
import { Badge } from "@/app/components/Badge";
import { Button, ActionButton } from "@/app/components/Button";
import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { IAuth } from "@/app/types/auth";
import { IPenumpang } from "@/app/types/jadwal";
import { API_TIKET_PENUMPANG } from "@/app/utils/api";
import { getStorageValue } from "@/app/utils/localstoreage";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {useState} from "react";
import { Loading } from "@/app/components/Loading";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";

interface IProps {
    penumpang: IPenumpang[];
}

export const ListPenumpang = (props: IProps) => {
    const [loading, setLoading] = useState(false);
    const cancelPenumpang = (kode_booking: any, nama_penumpang: any, no_identitas: any, jenis_kelamin: any, email: any) => {
        setLoading(true);
        const auth: IAuth = getStorageValue('auth');
        axios.put<any>(API_TIKET_PENUMPANG.EDIT_TIKET,
            {
                kode_booking: kode_booking,
                nama_penumpang: nama_penumpang,
                no_identitas: no_identitas,
                jenis_kelamin: jenis_kelamin,
                email: email,
                cancel: 1
            },
    {
                headers: {
                    Authorization: `Bearer ${auth.authorisation.token}`
                }
            }
        ).then((response) => {
            // response status 200 check
            if(response.status == 200){
                setLoading(false);
                // delete td from table where kode booking canceled
                const table = document.getElementById('table-penumpang');
                const tr = table?.getElementsByTagName('tr');
                for(let i = 0; i < tr!.length; i++){
                    const td = tr![i].getElementsByTagName('td')[1];
                    if(td){
                        if(td.innerHTML == kode_booking){
                            tr![i].remove();
                        }
                    }
                }
                toast.success('Data penumpang berhasil dicancel');
            }
        }).catch((error) => {
            console.log(error)
            setLoading(false);
        })
    }
    return(
        <>
            <table className="mt-5 border-collapse w-full p-8 my-4 text-left" id="table-penumpang">
                <HeadTb>
                    <tr>
                        <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                        <th className="text-sm font-robotomedium py-2">Kode Booking</th>
                        <th className="text-sm font-robotomedium py-2">Nama</th>
                        <th className="text-sm font-robotomedium py-2">No. Identitas</th>
                        <th className="text-sm font-robotomedium py-2">Jenis Kelamin</th>
                        <th className="text-sm font-robotomedium py-2">Email</th>
                        <th className="text-sm font-robotomedium py-2">Aksi</th>
                    </tr>
                </HeadTb>
                <tbody>
                    {props.penumpang.map((item, index)=> {
                        return(
                            <TableRow key={index} strip={index%2 == 1}>
                                <td className="pl-4 py-2">{index+1}</td>
                                <td className="py-2">{item.kode_booking}</td>
                                <td className="py-2">{item.nama_penumpang}</td>
                                <td className="py-2">{item.no_identitas}</td>
                                <td className="py-2">{item.jenis_kelamin == 'l' ? 'Laki-laki' : 'Perempuan'}</td>
                                <td className="py-2">{item.email}</td>
                                <td>
                                    <button onClick={()=>cancelPenumpang(item.kode_booking, item.nama_penumpang, item.no_identitas, item.jenis_kelamin, item.email)} className="h-[28px] w-[80px] text-xs rounded-full font-robotoregular border-solid border-2 border-primary hover:bg-primary hover:text-white">Cancel</button>
                                </td>
                                
                            </TableRow>
                        );
                    })}
                    <tr className="border border-[black] border-x-0">
                    </tr>
                </tbody>
            </table>
        </>
    );
}