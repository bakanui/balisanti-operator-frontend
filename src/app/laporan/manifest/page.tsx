"use client"
import { Inter } from '@next/font/google'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { SecondarySelectBox } from '@/app/components/SecondarySelectBox';
import { SecondaryDatePicker } from '@/app/components/SecondaryDatePicker';
import { PrinterIcon } from '@/assets/svg/PrinterIcon';
const inter = Inter({ subsets: ['latin'] })

export default function LaporanManifest() {
  return(
    <BaseContainer>
        <CustomBreadcumb noRoute title="Manifest"/>
        <BaseCard>
            <div className="sm:grid gap-x-6 grid-cols-2">
                <SecondarySelectBox 
                    label='Dermaga'
                    option={[{value: 'harian', label: 'Harian'}]}
                    placeholder='Pilih Data'
                />
                <SecondaryDatePicker 
                    label='Tanggal'
                />
            </div>
            <table className="border-collapse w-full p-8 my-4 text-left table-auto overflow-x-scroll w-full block">
              <thead className="border border-[black] border-x-0 ">
                  <tr>
                      <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                      <th className="text-sm font-robotomedium py-2">Kapal</th>
                      <th className="text-sm font-robotomedium py-2">Dermaga</th>
                      <th className="text-sm font-robotomedium py-2">Keberangkatan</th>
                      <th className="text-sm font-robotomedium py-2">Rute</th>
                      <th className="text-sm font-robotomedium py-2 min-w-[150px]">Penumpang</th>
                      <th className="text-sm font-robotomedium py-2 min-w-[150px]">Awak</th>
                      <th className="text-sm font-robotomedium py-2">Aksi</th>
                  </tr>
              </thead>
              <tbody>
                  <tr className="text-sm font-robotoregular">
                      <td className="pl-4 py-2">1</td>
                      <td className="py-2 min-w-[200px]">Wahana Express 1</td>
                      <td className="py-2 min-w-[200px]">Padangbai</td>
                      <td className="py-2 min-w-[200px]">26/01/2023    06:00</td>
                      <td className="py-2 min-w-[200px]">Padangbai - Gili Tarawangan</td>
                      <td className="py-2 min-w-[200px]">60/120</td>
                      <td className="py-2 min-w-[200px]">6/6</td>
                      <td className="py-2 min-w-[200px]">
                        <div className='flex justify-center cursor-pointer'>
                          <PrinterIcon />
                        </div>
                      </td>
                  </tr>
                  <tr className="text-sm font-robotoregular bg-[#F0F0F0]">
                      <td className="pl-4 py-2">1</td>
                      <td className="py-2">Wahana Express 1</td>
                      <td className="py-2">Padangbai</td>
                      <td className="py-2">26/01/2023    06:00</td>
                      <td className="py-2">Padangbai - Gili Tarawangan</td>
                      <td className="py-2">60/120</td>
                      <td className="py-2">6/6</td>
                      <td className="py-2">
                        <div className='flex justify-center cursor-pointer'>
                          <PrinterIcon />
                        </div>
                      </td>
                  </tr>
                  <tr className="text-sm font-robotoregular">
                      <td className="pl-4 py-2">1</td>
                      <td className="py-2">Wahana Express 1</td>
                      <td className="py-2">Padangbai</td>
                      <td className="py-2">26/01/2023    06:00</td>
                      <td className="py-2">Padangbai - Gili Tarawangan</td>
                      <td className="py-2">60/120</td>
                      <td className="py-2">6/6</td>
                      <td className="py-2">
                        <div className='flex justify-center cursor-pointer'>
                          <PrinterIcon />
                        </div>
                      </td>
                  </tr>
                  <tr className="text-sm font-robotoregular bg-[#F0F0F0]">
                      <td className="pl-4 py-2">1</td>
                      <td className="py-2">Wahana Express 1</td>
                      <td className="py-2">Padangbai</td>
                      <td className="py-2">26/01/2023    06:00</td>
                      <td className="py-2">Padangbai - Gili Tarawangan</td>
                      <td className="py-2">60/120</td>
                      <td className="py-2">6/6</td>
                      <td className="py-2">
                        <div className='flex justify-center cursor-pointer'>
                          <PrinterIcon />
                        </div>
                      </td>
                  </tr>
              </tbody>
            </table>
        </BaseCard>
    </BaseContainer>
  );
}
