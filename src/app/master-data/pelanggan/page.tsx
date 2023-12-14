'use client'
import { Badge } from "@/app/components/Badge";
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ActionButton, Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { SecondarySelectBox } from "@/app/components/SecondarySelectBox";
import { TableFilter } from "@/app/components/TableFilter";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from 'next/navigation';

export default function Pelanggan(){
    const router = useRouter();

    const gotoTambah = () => {
        router.push('/master-data/pelanggan/tambah');
    }

    return(
        <BaseContainer>
            <CustomBreadcumb title="Data Pelanggan"/>
            <BaseCard>
                <TableFilter />
                <table className="border-collapse w-full p-8 my-4 text-left">
                    <thead className="border border-[black] border-x-0 ">
                        <tr>
                            <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                            <th className="text-sm font-robotomedium py-2">Nama Pelanggan</th>
                            <th className="text-sm font-robotomedium py-2">Email</th>
                            <th className="text-sm font-robotomedium py-2">Status</th>
                            <th className="text-sm font-robotomedium py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-sm font-robotoregular">
                            <td className="pl-4 py-2">1</td>
                            <td className="py-2">Wiratma Jaya</td>
                            <td className="py-2">wiratmajaya62@gmail.com</td>
                            <td className="py-2">
                                <Badge 
                                    text="Aktif"
                                    status={true}
                                />
                            </td>
                            <td className="py-2 pr-2">
                                <div>
                                    <ActionButton 
                                        label="Aksi"
                                        outline={true}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr className="text-sm font-robotoregular bg-[#F0F0F0]">
                            <td className="pl-4 py-2">1</td>
                            <td className="py-2">Wiratma Jaya</td>
                            <td className="py-2">wiratmajaya62@gmail.com</td>
                            <td className="py-2">
                                <Badge 
                                    text="Aktif"
                                    status={true}
                                />
                            </td>
                            <td className="py-2 pr-2">
                                <div>
                                    <ActionButton 
                                        label="Aksi"
                                        outline={true}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </BaseCard>
        </BaseContainer>
    );
}