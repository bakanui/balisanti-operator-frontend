'use client'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ButtonGroup } from "@/app/components/ButtonGroup";
import { BaseContainer } from "@/app/components/Container";
import { Input } from "@/app/components/Input";
import { useRouter } from "next/navigation";

export default function AddSOP(){
    const router = useRouter();

    const back = () => {
        router.back();
    }

    return(
        <BaseContainer>
            <CustomBreadcumb
             title="Tambah SOP"
             onBack={back}
             />
            <BaseCard>
                <Input 
                    label="Nama SOP"
                    placeholder="Masukkan nama SOP"
                    onChangeText={()=>{}}
                    value={''}
                />
                <Input 
                    label="Keterangan"
                    placeholder="Masukkan keterangan"
                    onChangeText={()=>{}}
                    value={''}
                />
            </BaseCard>
            <ButtonGroup 
                onCancel={back}
            />
        </BaseContainer>
    );
}