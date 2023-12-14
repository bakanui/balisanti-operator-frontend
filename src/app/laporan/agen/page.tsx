"use client"
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { SecondaryDatePicker } from '@/app/components/SecondaryDatePicker';
import { ActionButton } from "@/app/components/Button";
import { TextWithLabel } from "./components/TextWithLabel";
import { TableFilter } from "@/app/components/TableFilter";

export default function LaporanAgen() {
  return(
    <BaseContainer>
        <CustomBreadcumb noRoute title="Laporan Agen"/>
        <BaseCard>
            <div className="sm:grid gap-x-6 grid-cols-2">
                <SecondaryDatePicker 
                  label="Periode"
                />
            </div>

            <div className="sm:grid gap-x-6 grid-cols-3 mt-6">
              <TextWithLabel 
                title="Total Tagihan"
                value="Rp. 78.000.000"
                color="#008AA1"
              />
              <TextWithLabel 
                title="Sudah Dibayarkan"
                value="Rp. 50.000.000"
                color="#48CF8E"
              />
              <TextWithLabel 
                title="Terhutang"
                value="Rp. 28.000.000"
                color="#EA4335"
              />
            </div>
        </BaseCard>
        <div className='mb-4'/>

        <BaseCard>
          <TableFilter />
          <table className="border-collapse w-full p-8 my-4 text-left">
            <thead className="border border-[black] border-x-0 ">
                <tr>
                    <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                    <th className="text-sm font-robotomedium py-2">Nama Agen</th>
                    <th className="text-sm font-robotomedium py-2">Tagihan</th>
                    <th className="text-sm font-robotomedium py-2">Sisa Hutang</th>
                    <th className="text-sm font-robotomedium py-2">Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr className="text-sm font-robotoregular">
                    <td className="pl-4 py-2">1</td>
                    <td className="py-2">Wiratma Jaya</td>
                    <td className="py-2">Rp. 5.600.000</td>
                    <td className="py-2">Rp. 400.000</td>
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
                    <td className="py-2">Rp. 5.600.000</td>
                    <td className="py-2">Rp. 400.000</td>
                    <td className="py-2 pr-2">
                        <div>
                            <ActionButton
                                label="Aksi"
                                outline={true}
                            />
                        </div>
                    </td>
                </tr>
                <tr className="text-sm font-robotoregular">
                    <td className="pl-4 py-2">1</td>
                    <td className="py-2">Wiratma Jaya</td>
                    <td className="py-2">Rp. 5.600.000</td>
                    <td className="py-2">Rp. 400.000</td>
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
                    <td className="py-2">Rp. 5.600.000</td>
                    <td className="py-2">Rp. 400.000</td>
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
