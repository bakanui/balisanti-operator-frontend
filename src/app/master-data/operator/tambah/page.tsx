'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { Button } from "@/app/components/Button";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { InputPassword } from "@/app/components/InputPassword";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { SelectBox } from "@/app/components/SelectBox";
import { ROLES } from "@/app/constants/roles";
import { getDermagaAction } from "@/app/master-data/dermaga/dermaga.service";
import { IOptions } from "@/app/types/auth";
import { IDermaga } from "@/app/types/dermaga";
import { generatePassword, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { createUserAction } from "../operator.service";

export default function AddOperator(){
    const router = useRouter();
    const [nama, setNama] = useState('');
    const [selectedRoles, setSelectedRoles] = useState({ value: '', label: 'Pilih Data' });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(generatePassword());
    const [dermaga, setDermaga] = useState<IOptions[]>([]);
    const [selectedDermaga, setselectedDermaga] = useState({ value: '', label: 'Pilih Data' });
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Memuat Data...');

    useEffect(()=>{
        setLoading(true);
        getDermagaAction(
            {
                limit: 100,
                status: 1
            },
            (data)=>{
                setLoading(false);
                let tmp = data.data.map((item: IDermaga)=> ({
                    value: item.id,
                    label: item.nama_dermaga
                }));
                setDermaga(tmp);
            },
            (err)=>{
                setLoading(false);
                toast.error(err, toastErrorConfig);
            },
            ()=> {
                router.replace('/login')
            }
        );
    },[]);

    const back = () => {
        router.back();
    }

    const generateCurrentPassword = () => {
        const tmpPwd = generatePassword();
        setPassword(tmpPwd);
    }

    const save = () => {
        setLoadingMessage('Menyimpan Data...');
        setLoading(true);
        console.log({
            name: nama,
                email: email,
                password: password,
                id_role: selectedRoles.value,
                id_dermaga: selectedRoles.value == '1' ? undefined : selectedDermaga.value,
        });
        
        createUserAction(
            {
                name: nama,
                email: email,
                password: password,
                id_role: selectedRoles.value,
                id_dermaga: selectedRoles.value == '1' ? undefined : selectedDermaga.value,
            },
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
            },
            () => router.replace('/login')
        );
    }

    return(
        <BaseContainer>
            <CustomBreadcumb
             title="Tambah User"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama User"
                    placeholder="Masukkan nama user"
                    onChangeText={(e)=>setNama(e.target.value)}
                    value={nama}
                />
                <SelectBox 
                    label="Hak Akses"
                    placeholder="Pilih data"
                    option={ROLES}
                    value={selectedRoles}
                    onChange={setSelectedRoles}
                />
                {selectedRoles.value == '2' || selectedRoles.value == '3' ? 
                    <SelectBox 
                        label="Lokasi Loket"
                        placeholder="Pilih data"
                        option={dermaga}
                        value={selectedDermaga}
                        onChange={setselectedDermaga}
                    />
                : null}
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <Input 
                        label="Email"
                        placeholder="Masukkan email operator"
                        onChangeText={(e)=>setEmail(e.target.value)}
                        value={email}
                        type='email'
                    />
                    <div className="flex w-full">
                        <div className="flex w-full mr-4">
                            <InputPassword 
                                label="Kata Sandi"
                                placeholder="Masukkan kata sandi untuk operator"
                                onChangeText={(e)=>setPassword(e.target.value)}
                                value={password}
                                hideForgotPassword={true}
                            />
                        </div>
                        
                        <div className="w-[150px] flex items-end pb-4">
                            <Button 
                                label="Generate"
                                onClick={generateCurrentPassword}
                            />
                        </div>
                    </div>
                </div>
                
            </BaseCard>
            <ButtonGroup 
                onCancel={back}
                onConfirm={save}
            />
            <LoadingOverlay
                loading={loading}
                title={loadingMessage}
            />
            <ToastContainer />
        </BaseContainer>
    );
}