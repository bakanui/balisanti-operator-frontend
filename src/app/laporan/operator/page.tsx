"use client"
import { Inter } from '@next/font/google'
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SecondarySelectBox } from '@/app/components/SecondarySelectBox';
import { SecondaryDatePicker } from '@/app/components/SecondaryDatePicker';
import { SmallBorderedButton } from '@/app/components/Button';
import { useEffect, useRef, useState } from 'react';
import { getDetailLaporanDermagaAction, getPenumpangByDermagaAction, getRekapDetailLaporanOperatorAction } from '../laporan.service';
import { getDermagaAction } from '@/app/master-data/dermaga/dermaga.service';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { LoadingOverlay } from '@/app/components/LoadingOverlay';
import { IAuth, IOptions } from '@/app/types/auth';
import { IDermaga, IDetailLaporanDermaga, IRekapDetailLaporan } from '@/app/types/dermaga';
import { getStorageValue } from '@/app/utils/localstoreage';
import { RangeDatePicker } from '@/app/components/RangeDatePicker';
import { convertLabelToPrice, getFirstAndLastDate, parseDateToBackendFormat } from '@/app/utils/utility';
import { Range } from 'react-date-range';
import { TableFilter } from '@/app/components/TableFilter';
import { debounce } from 'lodash';
import { Loading } from '@/app/components/Loading';
import { CustomTable, HeadTb, TableRow } from '@/app/components/MyTable';
import { Empty } from '@/app/components/Empty';
import { CustomPagination } from '@/app/components/CustomPagination';
const inter = Inter({ subsets: ['latin'] })

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  options: {
    
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    title: {
      display: false,
      text: 'title',
    },
  },
};

const labels = ['26 Jan 2023'];

const data = {
  labels,
  datasets: [
    {
      label: 'Pembayaran Tunai',
      data: labels.map(() => 35000000),
      backgroundColor: '#008AA1',
      barPercentage: 0.3,
      categoryPercentage: 1,
    },
    {
      label: 'Pembayaran Non Tunai',
      data: labels.map(() => 25000000),
      backgroundColor: '#48CF8E',
      barPercentage: 0.3,
      categoryPercentage: 1,
    },
  ],
};

export default function LaporanOperator() {
  const router = useRouter();
  const [data, setData] = useState<IDetailLaporanDermaga[]>([]);
  const [dermaga, setDermaga] = useState<IOptions[]>([]);
  const [selectedDermaga, setSelectedDermaga] = useState<IOptions>({value: '', label: 'Pilih Data'});
  const [rekapDetailLaporan, setRekapDetailLaporan] = useState<IRekapDetailLaporan>({
    tunai: 0,
    non_tunai: 0
  });
  const [dateRange, setDateRange] = useState<Range>({
    startDate: getFirstAndLastDate().first,
    endDate: getFirstAndLastDate().last,
    key: 'selection'
  });
  const [loading, setLoading] = useState(true);
  const [loadingOverlay, setLoadingOverlay] = useState(true);
  const [tmpDeleteData, setTmpDeleteData] = useState({
      id: 0,
      name: ''
  });
  const [pagination, setPagination] = useState({
      totalItems: 0,
      totalPage: 0,
      currentPage: 1
  });
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState({value: 10, label: '10'});
  const [showAlert, setShowAlert] = useState(false);
  const [graphicData, setGraphicData] = useState({
    data: {
      labels: [''],
      datasets: [
        {
          label: 'Pembayaran Tunai',
          data: labels.map(() => 0),
          backgroundColor: '#008AA1',
          barPercentage: 0.3,
          categoryPercentage: 1,
        },
        {
          label: 'Pembayaran Non Tunai',
          data: labels.map(() => 0),
          backgroundColor: '#48CF8E',
          barPercentage: 0.3,
          categoryPercentage: 1,
        },
      ],
    }
  });

  const debouncedSearch = useRef(
      debounce(async (e) => {
          setKeyword(e.target.value);
      }, 500)
  ).current;

  useEffect(()=>{
      getData();
  },[keyword, limit.value]);

  useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
  }, [debouncedSearch]);
  
  useEffect(()=> {
    getDermagaAction(
      {
        limit: 20,
        page: 1
      },
      (data)=>{
        let tmp = data.data.map((item: IDermaga)=> {
          return {
            value: item.id,
            label: item.nama_dermaga
          }
        });
        setDermaga(tmp);
        if (tmp.length > 0) {
          const auth: IAuth = getStorageValue('auth');
          let dermaga_id = 0;
          if (auth) {
              if (auth.user) {
                  dermaga_id = auth.user.id_dermaga
                  let dermagaTmp = tmp.filter((item: IOptions) => item.value == `${dermaga_id}`);
                  if (dermagaTmp.length > 0) setSelectedDermaga({value: dermagaTmp[0].value, label: dermagaTmp[0].label})
              }
          }
        }
        setLoadingOverlay(false);
      },
      (err)=>{
        toast.error(err);
        setLoadingOverlay(false);
      },
      ()=> router.replace('/login')
    );
  },[]);

  const getData = (page?: number) => {
    if (page && typeof page != 'number') {
        page = 1;
    }
    else if (page) {
      page = page + 1;
    }
    setLoading(true);
    getDetailLaporanDermagaAction(
        {
            limit: limit.value,
            nama: keyword,
            pagenumber: page || 1,
            id_loket: selectedDermaga.value,
            tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
            tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
        },
        (data)=>{
            setData(data.data);
            setPagination({
                totalItems: data.cnt,
                totalPage: data.totalPage,
                currentPage: page || 1
            });
            getRekapLaporan();
        },
        ()=>{
            setLoading(false);
        }
    );
  }

  const getRekapLaporan = () => {
    getRekapDetailLaporanOperatorAction(
      {
        id_loket: selectedDermaga.value,
        tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
        tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
      },
      (data)=> {
        setRekapDetailLaporan({
          tunai: Number(data.data.tunai) || 0,
          non_tunai: Number(data.data.non_tunai) || 0
        });
        setGraphicData({
          data: {
            labels: [`${dateRange.startDate} - ${dateRange.endDate}`],
            datasets: [
              {
                label: 'Pembayaran Tunai',
                data: labels.map(() => data.data.tunai || 0),
                backgroundColor: '#008AA1',
                barPercentage: 0.3,
                categoryPercentage: 1,
              },
              {
                label: 'Pembayaran Non Tunai',
                data: labels.map(() => data.data.non_tunai || 0),
                backgroundColor: '#48CF8E',
                barPercentage: 0.3,
                categoryPercentage: 1,
              },
            ],
          }
        });
        setLoading(false);
      },
      (err)=> {
        toast.error(err);
        setLoading(false);
      }
    );
  }

  const selectLoket = (e: any) => {
    let tmp = dermaga.filter((item: IOptions) => item.value == e.target.value);
    if (tmp.length > 0) setSelectedDermaga({value: tmp[0].value, label: tmp[0].label});
  }

  return(
    <BaseContainer>
        <CustomBreadcumb noRoute title="Laporan Operator"/>
        <BaseCard>
            <div className="sm:grid gap-x-6 grid-cols-2">
                <SecondarySelectBox 
                    label='Pilih Loket'
                    option={dermaga}
                    placeholder='Pilih Data'
                    value={selectedDermaga.value}
                    onChange={selectLoket}
                />
                <RangeDatePicker
                    label="Periode"
                    date={dateRange}
                    onChange={(date)=> setDateRange(date)}
                    onFilter={getData}
                    filterText={'Cari Jadwal'}
                />
            </div>
        </BaseCard>
        <div className='mb-4'/>

        <BaseCard>
            <div className='mb-4'>
                <span className='font-robotoregular text-md mr-8'>Total Pendapatan</span>
                <span className='font-robotomedium text-md'>Rp. {convertLabelToPrice(`${Number(rekapDetailLaporan.non_tunai) + Number(rekapDetailLaporan.tunai)}`)}</span>
            </div>
            <Bar 
                options={options} 
                data={graphicData.data} 
                height={100}
            />
        </BaseCard>
        <div className='mb-4'/>

        <BaseCard>
          <TableFilter
              onChange={debouncedSearch}
              limitChange={(e)=>setLimit({value: e.target.value, label: e.target.value})}
          />
          {loading ? 
              <Loading
                  loading={loading}
                  title="Memuat Data"
              />
          :
          <>
          <CustomTable>
              <HeadTb>
                  <tr>
                      <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                      <th className="text-sm font-robotomedium py-2">Nama</th>
                      <th className="text-sm font-robotomedium py-2">Jenis Transaksi</th>
                      <th className="text-sm font-robotomedium py-2">Metode</th>
                      <th className="text-sm font-robotomedium py-2">Nominal</th>
                      <th className="text-sm font-robotomedium py-2">Waktu Transaksi</th>
                  </tr>
                </HeadTb>
              <tbody>
                  {data.map((item, index)=> {
                      let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit.value;
                      return(
                          <TableRow key={index+"-"+item.nama_operator} strip={index%2 == 1}>
                              <td className="pl-4 py-2">{startingNumber+index+1}</td>
                              <td className="py-2">{item.nama_operator}</td>
                              <td className="py-2">{item.jenis_transaksi}</td>
                              <td className="py-2">{item.metode_bayar || '-'}</td>
                              <td className="py-2">Rp. {convertLabelToPrice(`${item.nominal}`)}</td>
                              <td className="py-2">{item.waktu_bayar || '-'}</td>
                          </TableRow>
                      );
                  })}
              </tbody>
            </CustomTable>
            {!loading && data.length == 0 ? 
                <Empty
                    title="Tidak ada data ditemukan"
                />
            : null}
            <CustomPagination
                totalItems={pagination.totalItems}
                totalPage={pagination.totalPage}
                onPageChange={(e)=>getData(e.selected)}
                limit={limit.value}
                totalData={data.length}
                currentPage={pagination.currentPage}
            />
            </>
            }
        </BaseCard>
        <LoadingOverlay 
          loading={loadingOverlay}
          title="Memuat Data..."
        />
    </BaseContainer>
  );
}
