"use client"
import { Inter } from '@next/font/google'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { Badge } from './components/Badge';
import { SeeMore } from './components/SeeMore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IDashboardData, useDashboard } from '@/hooks/dashboard.hook';
import { RangeDatePicker } from './components/RangeDatePicker';
import { convertLabelToPrice, getFirstAndLastDate, parseDateToBackendFormat } from './utils/utility';
import { Range } from 'react-date-range';
import { LoadingOverlay } from './components/LoadingOverlay';
import { TableRow } from './components/MyTable';
import { PembayaranChart } from './components/PembayaranChart';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const router = useRouter();
    const [data, setParams, loading] = useDashboard();
    const [dateRange, setDateRange] = useState<Range>({
        startDate: getFirstAndLastDate().first,
        endDate: getFirstAndLastDate().last,
        key: 'selection'
      });

    useEffect(()=>{
        getReport();
    },[]);

    const getReport = () => {
        const params = {
            tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
            tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date())
        };
        setParams(params);
    }
    
  return(
    <BaseContainer>
        <CustomBreadcumb noRoute title="Dashboard"/>
        <BaseCard>
            <RangeDatePicker
                label="Periode"
                date={dateRange}
                onChange={(date)=> setDateRange(date)}
                onFilter={getReport}
                filterText={'Cari Jadwal'}
            />
        </BaseCard>
        <div className='mb-3'/>
        <BaseCard>
            <div className='mb-4'>
                <span className='font-robotoregular text-md mr-8'>Total Pendapatan</span>
                <span className='font-robotomedium text-md'>Rp. {convertLabelToPrice(data ? data.pendapatan : '0')}</span>
            </div>
            <PembayaranChart 
              pembayaran={data.pembayaran}
            />
        </BaseCard>
        <div className='flex mt-4'>
          <div className="w-full dark:bg-slate-700 h-fit mr-4 bg-white p-2 sm:p-8 rounded-xl">
            <div className='font-robotomedium text-md'>List Kapal</div>
            <table className="border-collapse w-full p-8 my-4 text-left">
              <thead className="border border-[black] border-x-0 ">
                  <tr>
                      <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                      <th className="text-sm font-robotomedium py-2">Nama Kapal</th>
                      <th className="text-sm font-robotomedium py-2">Mesin Kapal</th>
                      <th className="text-sm font-robotomedium py-2">Jenis Kapal</th>
                      <th className="text-sm font-robotomedium py-2">Kapasitas</th>
                      <th className="text-sm font-robotomedium py-2">Status</th>
                  </tr>
              </thead>
              <tbody>
                {data.kapals.map((item: IDashboardData['kapals'], index: number)=> {
                    return(
                        <TableRow key={item.nama_kapal} strip={index%2 == 1}>
                            <td className="pl-4 py-2">{index+1}</td>
                            <td className="py-2">{item.nama_kapal}</td>
                            <td className="py-2">{item.mesin}</td>
                            <td className="py-2">{item.nama_jenis_kapal}</td>
                            <td className="py-2">{item.kapasitas_penumpang}</td>
                            <td className="py-2">
                                <Badge 
                                    text={item.status_kapal == 1 ? 'Aktif' : 'Tidak Aktif'}
                                    status={item.status_kapal == 1}
                                />
                            </td>
                        </TableRow>
                    );
                })}
              </tbody>
            </table>
            <SeeMore onClick={()=> router.push('/master-data/kapal')}/>
          </div>

          <div className="w-full h-fit bg-white dark:bg-slate-700 p-2 sm:p-8 rounded-xl">
            <div className='font-robotomedium text-md'>List Keberangkatan</div>
            <table className="border-collapse w-full p-8 my-4 text-left">
                <thead className="border border-[black] border-x-0 ">
                    <tr>
                        <th className="text-sm font-robotomedium text-center">Jadwal</th>
                        <th className="text-sm font-robotomedium py-2">Nahkoda</th>
                        <th className="text-sm font-robotomedium py-2">Nama Kapal</th>
                        <th className="text-sm font-robotomedium py-2">Rute</th>
                    </tr>
                </thead>
                <tbody>
                    {data.jadwals.map((item: IDashboardData['jadwals'], index: number)=> {
                        return(
                            <TableRow key={index} strip={index%2 == 1}>
                                <td className="py-2 text-center">{item.waktu_berangkat}</td>
                                <td className="py-2">{item.nama_nahkoda}</td>
                                <td className="py-2">{item.nama_kapal}</td>
                                <td className="py-2">{item.rute}</td>
                            </TableRow>
                        );
                    })}
                </tbody>
            </table>
            <SeeMore onClick={()=> router.push('/master-data/jadwal')}/>
          </div>
        </div>
        <LoadingOverlay 
            title='Memuat Data'
            loading={loading}
        />
    </BaseContainer>
  );
}
