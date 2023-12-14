/* eslint-disable no-use-before-define */
"use client"
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { SecondarySelectBox } from '@/app/components/SecondarySelectBox';
import { useEffect, useRef, useState } from 'react';
import { editManifestKedatanganAction, getPenumpangByJadwalAction, getPenumpangByRuteAction } from '../laporan.service';
import { Loading } from '@/app/components/Loading';
import { Empty } from '@/app/components/Empty';
import { CustomPagination } from '@/app/components/CustomPagination';
import { convertLabelToPrice, getFirstAndLastDate, parseDateIncludeHours, parseDateToBackendFormat, toastErrorConfig} from '@/app/utils/utility';
import { TableFilter } from '@/app/components/TableFilter';
import { debounce } from 'lodash';
import { RangeDatePicker } from '@/app/components/RangeDatePicker';
import { Range } from 'react-date-range';
import { getPenjualanAction } from '@/app/penjualan-tiket/penjualanTiket.service';
import { toast, ToastContainer } from 'react-toastify';
import { LoadingOverlay } from '@/app/components/LoadingOverlay';
import { useRouter } from 'next/navigation';
import { IOptions } from '@/app/types/auth';
import { CheckBox } from '@/app/components/CheckBox';
import { getStorageValue } from '@/app/utils/localstoreage';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/app/components/Button';
import { HeadTb, TableRow } from '@/app/components/MyTable';
import { FROM_ROUTE_ID, FROM_ROUTE_LABEL, TO_ROUTE_ID, TO_ROUTE_LABEL } from '@/constants/customRoute';
export interface IPagination {
  totalItems: number;
  totalPage: number;
  currentPage: number;
}

export default function LaporanPenumpang() {
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const componentRef: any = useRef();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [pagination, setPagination] = useState<IPagination>({
      totalItems: 0,
      totalPage: 0,
      currentPage: 1
  });
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState({value: 10, label: '10'});
  const [dateRange, setDateRange] = useState<Range>({
    startDate: getFirstAndLastDate().first,
    endDate: getFirstAndLastDate().last,
    key: 'selection'
  });
  const [jadwal, setjadwal] = useState<IOptions[]>([
    {value: '', label: 'Pilih Data'}
  ]);
  const [selectedJadwal, setSelectedJadwal] = useState({value: '', label: 'Pilih Data'});
  const [jumlahPenumpang, setJumlahPenumpang] = useState('0');
  const debouncedSearch = useRef(
    debounce(async (e) => {
        setKeyword(e.target.value);
    }, 500)
  ).current;
  const [selectedPenumpang, setSelectedPenumpang] = useState<any[]>([]);
  const [checkAll, setCheckAll] = useState(false);
  const [statistik, setStatistik] = useState({
    cancel: 0,
    real: 0
  });


  useEffect(()=> {
    const tmpUser = getStorageValue('auth');
    if (tmpUser) {
      console.log(tmpUser);
      setUser(tmpUser.user);
    }
    cariJadwal();
  },[]);

  useEffect(()=>{
    getData();
  },[keyword, limit.value, selectedJadwal.value]);

  useEffect(() => {
      return () => {
        debouncedSearch.cancel();
      };
  }, [debouncedSearch]);

  const getData = (page?: number) => {
    if (!selectedJadwal.value) return;
    if (page && typeof page != 'number') {
        page = 1;
    }
    else if (page) {
      page = page + 1;
    }
    setLoading(true);
    if(selectedJadwal.value == FROM_ROUTE_ID || selectedJadwal.value == TO_ROUTE_ID) {
      getPenumpangByRuteAction(
        {
            rutes: selectedJadwal.value,
            limit: limit.value,
            nama_penumpang: keyword,
            pagenumber: page || 1,
            tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
            tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
        },
        (data)=>{
            setData(data.data);
            setJumlahPenumpang(data.cnt);
            setPagination({
                totalItems: data.cnt,
                totalPage: data.totalPage,
                currentPage: page || 1
            });
            setStatistik({
              cancel: data.jml_cancel,
              real: data.jml_real
            });
            setLoading(false);
        },
        ()=>{
            setLoading(false);
        }
      );
      return;
    }

    getPenumpangByJadwalAction(
        {
            id_jadwal: selectedJadwal.value,
            limit: limit.value,
            nama_penumpang: keyword,
            pagenumber: page || 1,
            tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
            tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
        },
        (data)=>{
            setData(data.data);
            setJumlahPenumpang(data.cnt);
            setPagination({
                totalItems: data.cnt,
                totalPage: data.totalPage,
                currentPage: page || 1
            });
            setLoading(false);
        },
        ()=>{
            setLoading(false);
        }
    );
  }

  const cariJadwal = () => {
    setLoadingOverlay(true);
    setData([]);
    setJumlahPenumpang('0');
    setPagination({
        totalItems: 0,
        totalPage: 0,
        currentPage: 1
    });
    getPenjualanAction(
      {
          limit: 100,
          tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
          tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
      },
      (data)=>{
          let tmp = data.data.map((item: any) => {
            return {
              value: item.id_jadwal,
              label: `(${item.waktu_berangkat} WITA) ${item.nama_rute}`
            }
          });
          let fromCustomRoute = {value: FROM_ROUTE_ID, label: FROM_ROUTE_LABEL},
          toCustomRoute = {value: TO_ROUTE_ID, label: TO_ROUTE_LABEL};
          setjadwal([{value: '', label: 'Pilih Data'}, ...tmp]);
          setSelectedJadwal({value: '', label: 'Pilih Data'});
          setLoadingOverlay(false);
      },
      (err)=>{
          setLoadingOverlay(false);
          toast.error(err, toastErrorConfig);
      },
      () => router.replace('/login')
    );
  }

  const selectJadwal = (e: any) => {
    let tmp = jadwal.filter((item) => item.value == e.target.value);
    if (tmp.length > 0) {
      setSelectedJadwal(tmp[0]);
    }
  }

  const handleDownload = useReactToPrint({
    onPrintError: (error) => console.log(error),
    content: () => componentRef.current,
    removeAfterPrint: true,
    print: async (printIframe) => {
      const document = printIframe.contentDocument;
      if (document) {
        const html = document.getElementById("penumpang-print");
        // remove all first th checklist and td checklist if not admin
        if(user && user.id_role != 1){
          if (html) {
            const thChecklist = html.querySelector('th:first-child');
            const tdChecklist = html.querySelectorAll('td:first-child');
            if (thChecklist) {
              thChecklist.remove();
            }
            tdChecklist.forEach((item) => {
              item.remove();
            });
          }
        }
        var opt = {
          margin:       0.5,
          filename:     'Penumpang.pdf',
          image:        { type: 'jpeg', quality: 1 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        const Html2Pdf = (await import('html2pdf.js')).default;
        const exporter = new Html2Pdf(html,opt);
        exporter.getPdf(true);
      }
    },
  });

  const selectAllListPenumpang = () => {
    setLoading(true);
    getPenumpangByJadwalAction(
        {
            id_jadwal: selectedJadwal.value,
            limit: 10000000000,
            nama_penumpang: null,
            tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
            tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
        },
        (data)=>{
            const tmpKodeBooking = data.data.map((item: any) => item.kode_booking);
            setSelectedPenumpang(tmpKodeBooking);
            setLoading(false);
        },
        ()=>{
            setLoading(false);
        }
    );
  }

  const selectPenumpang = (kode_booking: any) => {
    let tmp = selectedPenumpang.filter((item) => item == kode_booking);
    if (tmp.length > 0) {
      let tmpSelectedPenumpang = selectedPenumpang.filter((item) => item != kode_booking);
      setSelectedPenumpang(tmpSelectedPenumpang);
    }
    else {
      setSelectedPenumpang([...selectedPenumpang, kode_booking]);
    }
  }

  const onCheckAll = () => {
    setCheckAll(!checkAll);
    if (checkAll) {
      setLoading(true);
      setSelectedPenumpang([]);
      setLoading(false);
    }
    else {
      selectAllListPenumpang();
    }
  }

  useEffect(() => {
    setSelectedPenumpang([]);
    setCheckAll(false);
  }, [dateRange, jadwal, selectedJadwal]);

  const tandaiKedatangan = () => {
    if(selectedPenumpang.length == 0) {
      toast.error('Mohon pilih penumpang terlebih dahulu!');
      return;
    }
    setLoading(true);
    editManifestKedatanganAction(
      {
        kode_booking: selectedPenumpang,
        status_manifest: 1
      },
      (response)=>{
        toast.success('Berhasil menandai keberangkatan penumpang!');
        setSelectedPenumpang([]);
        setCheckAll(false);
        getData();
      },
      (err)=>{
        console.log(err);
        toast.error('Gagal menandai keberangkatan penumpang!');
      }
    );
    setLoading(false);
  }

  const tandaiKeberangkatan = () => {
    if(selectedPenumpang.length == 0) {
      toast.error('Mohon pilih penumpang terlebih dahulu!');
      return;
    }
    setLoading(true);
    editManifestKedatanganAction({
        kode_booking: selectedPenumpang,
        status_manifest: 2
      },(response)=>{
        toast.success('Berhasil menandai keberangkatan penumpang!');
        setSelectedPenumpang([]);
        setCheckAll(false);
        getData();
      },(err)=>{
        console.log(err);
        toast.error('Gagal menandai keberangkatan penumpang!');
      }
    );
    setLoading(false);
  }

  return(
    <BaseContainer>
        <CustomBreadcumb noRoute title="Laporan Penumpang"/>
        <BaseCard>
            <div className="sm:grid gap-x-6 grid-cols-2">
                <RangeDatePicker
                    label="Periode"
                    date={dateRange}
                    onChange={(date)=> setDateRange(date)}
                    onFilter={cariJadwal}
                    filterText={'Cari Jadwal'}
                />
                <SecondarySelectBox 
                    label='Jadwal Keberangkatan'
                    option={jadwal}
                    placeholder='Pilih Data'
                    value={selectedJadwal.value}
                    onChange={selectJadwal}
                />
            </div>
        </BaseCard>
        <div className='mb-4'/>

        <BaseCard>
            <div className='mb-4 sm:grid gap-x-6 grid-cols-3'>
              <div>
                <span className='font-robotoregular text-md mr-8'>Jumlah Penumpang</span>
                <span className='font-robotomedium text-xl'>: {statistik.real || '-'} orang</span>
              </div>
              <div>
                <span className='font-robotoregular text-md mr-8'>Jumlah Cancel</span>
                <span className='font-robotomedium text-xl'>: {statistik.cancel || '-'} orang</span>
              </div>
              <div>
                <span className='font-robotoregular text-md mr-8'>Total</span>
                <span className='font-robotomedium text-xl'>: {jumlahPenumpang || '-'} orang</span>
              </div>
            </div>
        </BaseCard>
        <div className='mb-4'/>

        <BaseCard>
          <TableFilter
              onChange={debouncedSearch}
              limitChange={(e)=>setLimit({value: e.target.value, label: e.target.value})}
          />
          <div className='flex gap-3 mt-5'>
          {data.length > 0 ? 
            <>
              <div className='w-1/4'>
                <Button 
                  label='Download'
                  onClick={handleDownload}
                />
              </div>
            </>
            : null
          }
          {
            user && user.id_role != 1 ?
            <>
            <button 
              onClick={tandaiKedatangan} 
              className='bg-primary h-[48px] w-1/4 text-white text-sm rounded-lg font-robotoregular hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={selectedPenumpang.length > 0 ? false : true}
              >
                Tandai Datang {selectedPenumpang.length > 1 ? `(${selectedPenumpang.length})` : null}
              </button>
              <button 
              onClick={tandaiKeberangkatan} 
              className='bg-primary h-[48px] w-1/4 text-white text-sm rounded-lg font-robotoregular hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={selectedPenumpang.length > 0 ? false : true}>
                Tandai Berangkat {selectedPenumpang.length > 1 ? `(${selectedPenumpang.length})` : null}
              </button>
            </>
            : null
          }
          </div>
          {loading ? 
              <Loading
                  loading={loading}
                  title="Memuat Data"
              />
          :
          <div className='overflow-x-scroll'>
           <div ref={componentRef} id="penumpang-print">
            <table className="border-collapse w-full p-8 my-4 text-left">
               <HeadTb>
                   <tr>
                     { user && user.id_role == 3 ?
                       <th className="text-sm font-robotomedium pl-4 py-2">
                         <CheckBox selected={checkAll} onClick={onCheckAll} text=""/>
                       </th>
                     : null }
                       <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                       <th className="text-sm font-robotomedium py-2">Nama Penumpang</th>
                       <th className="text-sm font-robotomedium py-2">Kode Booking</th>
                       <th className="text-sm font-robotomedium py-2">Tanggal Keberangkatan</th>
                       <th className="text-sm font-robotomedium py-2">Tanggal Return</th>
                       <th className="text-sm font-robotomedium py-2">Tujuan</th>
                       <th className="text-sm font-robotomedium py-2">Agen</th>
                       <th className="text-sm font-robotomedium py-2">Service</th>
                       <th className="text-sm font-robotomedium py-2">Manifest</th>
                       <th className="text-sm font-robotomedium py-2">Entry By</th>
                       <th className="text-sm font-robotomedium py-2">Collect</th>
                   </tr>
               </HeadTb>
               <tbody>
               {data.map((item, index)=> {
                       let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit.value;
                       return(
                           <TableRow key={item.id} strip={index%2 == 1} is_canceled={item.flag_cancel}>
                               { user && user.id_role == 3 ?
                                 <td className="pl-4 py-2">
                                   <CheckBox selected={selectedPenumpang.includes(item.kode_booking)} onClick={()=>selectPenumpang(item.kode_booking)} text=""/>
                                 </td>
                               : null }
                               <td className="pl-4 py-2">{startingNumber+index+1}</td>
                               <td className="py-2">{item.nama_penumpang}</td>
                               <td className="py-2">{item.kode_booking}</td>
                               <td className="py-2">{parseDateIncludeHours(new Date(item.tanggal || ''), true)}</td>
                               <td className="py-2">{item.tanggal_rt ? parseDateIncludeHours(new Date(item.tanggal_rt || ''), true) : '-'}</td>
                               <td className="py-2">{item.tujuan || '-'}</td>
                               <td className="py-2">{item.nama_agen || '-'}</td>
                               <td className="py-2">{item.service || '-'}</td>
                               <td className="py-2">
                                 {item.flag_cancel == 1 ? 'Cancel' : item.status_manifest}
                               </td>
                               <td className="py-2">{item.created_by || '-'}</td>
                               {item.jumlah_collect != undefined ? <td className="py-2">Rp. {convertLabelToPrice(item.jumlah_collect)}</td> : <td className="py-2">Rp. 0</td>}
                           </TableRow>
                       );
                   })}
               </tbody>
            </table>
          </div>
          {!loading && data.length == 0 ? 
              <Empty
                  title="Tidak ada data ditemukan"
                  subtitle='Atau silakan pilih jadwal keberangkatan terlebih dahulu!'
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
          </div>
          }

          <LoadingOverlay 
            loading={loadingOverlay}
            title="Memuat Data"
          />
        <ToastContainer />
        </BaseCard>
    </BaseContainer>
  );
}
