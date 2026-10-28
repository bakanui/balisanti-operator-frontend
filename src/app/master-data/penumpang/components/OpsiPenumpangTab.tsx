'use client'
import { Alert } from "@/app/components/Alert";
import { Button, ActionButton } from "@/app/components/Button";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { CustomModal } from "@/app/components/CustomModal";
import { Empty } from "@/app/components/Empty";
import { Input } from "@/app/components/Input";
import { Loading } from "@/app/components/Loading";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { IOpsiPenumpang } from "@/app/types/penumpang";
import { toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createOpsiPenumpangAction, deleteOpsiPenumpangAction, editOpsiPenumpangAction, getOpsiPenumpangAction } from "../penumpang.service";

interface IProps {
    kategori: 'tipe' | 'jenis';
    title: string;
}

export const OpsiPenumpangTab = ({ kategori, title }: IProps) => {
    const [data, setData] = useState<IOpsiPenumpang[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ id: 0, nama: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [tmpDelete, setTmpDelete] = useState({ id: 0, nama: '' });

    useEffect(()=>{
        getData();
    },[kategori]);

    const getData = () => {
        setLoading(true);
        getOpsiPenumpangAction(
            { kategori },
            (res)=>{
                setData(res.data);
                setLoading(false);
            },
            (err)=>{
                setLoading(false);
                toast.error(err, toastErrorConfig);
            }
        );
    }

    const openTambah = () => {
        setForm({ id: 0, nama: '' });
        setShowForm(true);
    }

    const openEdit = (item: IOpsiPenumpang) => {
        setForm({ id: item.id, nama: item.nama });
        setShowForm(true);
    }

    const onSuccessSave = () => {
        setSaving(false);
        setShowForm(false);
        toast.success('Data Berhasil Disimpan', toastSuccessConfig);
        getData();
    }

    const onFailed = (err: any) => {
        setSaving(false);
        toast.error(err, toastErrorConfig);
    }

    const save = () => {
        const nama = form.nama.trim();
        if (!nama) {
            toast.error(`Nama ${title} tidak boleh kosong!`, toastErrorConfig);
            return;
        }
        setSaving(true);
        if (form.id) {
            editOpsiPenumpangAction({ id: form.id, nama }, onSuccessSave, onFailed);
        } else {
            createOpsiPenumpangAction({ kategori, nama }, onSuccessSave, onFailed);
        }
    }

    const deleteData = () => {
        setShowAlert(false);
        setSaving(true);
        deleteOpsiPenumpangAction(
            tmpDelete.id,
            ()=>{
                setSaving(false);
                toast.success('Berhasil menghapus data', toastSuccessConfig);
                getData();
            },
            onFailed
        );
    }

    return(
        <>
            <div className="w-[220px] mb-4">
                <Button
                    label={`Tambah ${title}`}
                    icon={faPlus}
                    onClick={openTambah}
                />
            </div>
            {loading ?
                <Loading
                    loading
                    title="Memuat Data..."
                />
            :
            <>
            <CustomTable>
                <HeadTb>
                    <tr>
                        <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                        <th className="text-sm font-robotomedium py-2">{title}</th>
                        <th className="text-sm font-robotomedium py-2">Aksi</th>
                    </tr>
                </HeadTb>
                <tbody>
                    {data.map((item, index)=> (
                        <TableRow key={item.id} strip={index%2 == 1}>
                            <td className="pl-4 py-2">{index+1}</td>
                            <td className="py-2">{item.nama}</td>
                            <td className="py-2 pr-2">
                                <ActionButton
                                    label="Aksi"
                                    outline={true}
                                    onEdit={()=>openEdit(item)}
                                    onDelete={()=>{
                                        setTmpDelete({ id: item.id, nama: item.nama });
                                        setShowAlert(true);
                                    }}
                                />
                            </td>
                        </TableRow>
                    ))}
                </tbody>
            </CustomTable>
            {data.length == 0 ?
                <Empty
                    title="Tidak ada data ditemukan"
                />
            : null}
            </>}
            <CustomModal
                modalIsOpen={showForm}
                closeModal={()=>setShowForm(false)}
            >
                <div className="w-[400px] max-w-full">
                    <div className="font-robotomedium text-lg mb-4">{form.id ? 'Edit' : 'Tambah'} {title}</div>
                    <Input
                        label={title}
                        placeholder={`Masukkan ${title.toLowerCase()}`}
                        value={form.nama}
                        onChangeText={(e)=>setForm({...form, nama: e.target.value})}
                        required
                    />
                    {form.id ?
                        <div className="text-xs font-robotoregular text-gray-500 mb-4">
                            Data jenis penumpang yang memakai nama lama akan ikut diganti.
                        </div>
                    : null}
                    <ButtonGroup
                        onCancel={()=>setShowForm(false)}
                        onConfirm={save}
                    />
                </div>
            </CustomModal>
            <Alert
                title={`Hapus ${title}`}
                content={`Apakah Anda yakin ingin menghapus ${tmpDelete.nama} ?`}
                confirmText="Ya"
                cancelText="Tidak"
                isOpen={showAlert}
                closeAlert={()=>setShowAlert(false)}
                confirmAlert={deleteData}
            />
            <LoadingOverlay
                loading={saving}
                title="Menyimpan Data..."
            />
        </>
    );
}
