/* eslint-disable no-use-before-define */
"use client"
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { SecondarySelectBox } from '@/app/components/SecondarySelectBox';
import { useEffect, useRef, useState } from 'react';
import { editManifestKedatanganAction, getPenumpangByJadwalAction, getPenumpangByRuteAction, getPembayaranByJadwalAction } from '../laporan.service';
import { Loading } from '@/app/components/Loading';
import { Empty } from '@/app/components/Empty';
import { CustomPagination } from '@/app/components/CustomPagination';
import { convertLabelToPrice, getFirstAndLastDate, parseDateIncludeHours, parseDateToBackendFormat, toastErrorConfig, isSameDate, parseDateToShortFormat} from '@/app/utils/utility';
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
import { handleDownloadBA, handleDownloadGT, handleDownloadJasa, handleDownloadManifestPembayaran } from "@/hooks/invoice.hook";
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { Bar } from 'react-chartjs-2';
import fileDownload from 'js-file-download';
import { FROM_ROUTE_ID, FROM_ROUTE_LABEL, TO_ROUTE_ID, TO_ROUTE_LABEL } from '@/constants/customRoute';
import { PembayaranChartLaporan } from "@/app/components/PembayaranChart";
export interface IPagination {
  totalItems: number;
  totalPage: number;
  currentPage: number;
}

export interface IPassengers {
  no_index: number,
  kode_booking: string,
  no_invoice: string,
  nama_penumpang: string,
  email: string,
  tujuan: string,
  jenis_kelamin: string,
  no_identitas: string,
  tanggal: string,
  waktu_berangkat: string,
  tipe: string,
  alamat: string,
  warganegara: string,
  status_manifest: string,
  id_created_by: number,
  created_by: string,
  nama_agen: string,
  service: number,
  flag_cancel: number,
  status_collect: number,
  tanggal_rt: null
}

interface DataTotalItem {
  jenis_pembayaran: string;
  total_harga: number;
}

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

export default function LaporanPembayaran() {
  const router = useRouter();
  const labels = ['26 Jan 2023'];
  const [user, setUser] = useState<any>();
  const componentRef: any = useRef();
  const [data, setData] = useState<any[]>([]);
  const [listJadwal, setListJadwal] = useState<any[]>([]);
  const [dataPembayaran, setDataPembayaran] = useState<any[]>([]);
  const [dataAll, setDataAll] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPembayaran, setTotalPembayaran] = useState<any>();
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [pagination, setPagination] = useState<IPagination>({
      totalItems: 0,
      totalPage: 0,
      currentPage: 1
  });
  const [graphicData, setGraphicData] = useState({
    data: {
      labels: [''],
      datasets: [
        {
          label: 'Tunai',
          data: labels.map(() => 0),
          backgroundColor: '#219ebc',
          barPercentage: 0.3,
          categoryPercentage: 1,
        },
        {
          label: 'QRIS',
          data: labels.map(() => 0),
          backgroundColor: '#c1121f',
          barPercentage: 0.3,
          categoryPercentage: 1,
        },
        {
          label: 'Virtual Account',
          data: labels.map(() => 0),
          backgroundColor: '#283618',
          barPercentage: 0.3,
          categoryPercentage: 1,
        },
      ],
    }
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

  function jenisPembayaranSpawner(jenis: string){
    switch (jenis){
      case "tunai":
        return "Tunai";
      case "debit":
        return "Kartu Debit";
      case "kredit":
        return "Kartu Kredit";
      case "qris":
        return "QRIS";
      case "va":
        return "Virtual Account BPD";
    }
  }

  const handleDownloadLapGT = () => {
    setLoading(true);
    let fileName = 'LaporanGT_';
          if (isSameDate(dateRange.startDate || new Date(), dateRange.endDate || new Date())) {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + '.pdf';
          } else {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + "-" + parseDateToShortFormat(dateRange.endDate || new Date()) + '.pdf';
          }
    handleDownloadGT(
      {
          id_jadwal: listJadwal,
          tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
          tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date())
      },
      (data)=>{
          fileDownload(data, fileName);
          setLoading(false);
      },
      ()=>{
          setLoading(false);
      }
  );
  }

  const handleDownloadLapJasa = () => {
    setLoading(true);
    let fileName = 'LaporanJasa_';
          if (isSameDate(dateRange.startDate || new Date(), dateRange.endDate || new Date())) {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + '.pdf';
          } else {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + "-" + parseDateToShortFormat(dateRange.endDate || new Date()) + '.pdf';
          }
    const match = selectedJadwal.label.match(/\((\d{2}:\d{2})/);
    const waktu = match ? match[1] : '';
    handleDownloadJasa(
      {
          tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
          tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
          waktu: waktu
      },
      (data)=>{
          fileDownload(data, fileName);
          setLoading(false);
      },
      ()=>{
          setLoading(false);
      }
  );
  }

  const handleDownloadLapBA = () => {
    setLoading(true);
    let fileName = 'LaporanBeritaAcara_';
          if (isSameDate(dateRange.startDate || new Date(), dateRange.endDate || new Date())) {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + '.pdf';
          } else {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + "-" + parseDateToShortFormat(dateRange.endDate || new Date()) + '.pdf';
          }
    const match = selectedJadwal.label.match(/\((\d{2}:\d{2})/);
    const waktu = match ? match[1] : '';
    handleDownloadBA(
      {
        id_jadwal: selectedJadwal.value,
        tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
        tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date())
      },
      (data)=>{
          fileDownload(data, fileName);
          setLoading(false);
      },
      ()=>{
          setLoading(false);
      }
  );
  }

  const getData = (page?: number) => {
    if (page && typeof page != 'number') {
      page = 1;
    }
    else if (page) {
      page = page + 1;
    }
    if (!selectedJadwal.value) {
      getPembayaranByJadwalAction(
        {
          limit: limit.value,
          nama_penumpang: keyword,
          pagenumber: page || 1,
          tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
          tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
        },
        (data)=>{
          setData(data.data);
          setDataPembayaran(data.dataTotal);
          setPagination({
              totalItems: data.cnt,
              totalPage: data.totalPage,
              currentPage: page || 1
          });
          setStatistik({
            cancel: data.cntCancel,
            real: data.jumlah[0].total
          });
          const dataTotal = data.dataTotal.reduce((acc: { tunai: any; qr: any; va: any; }, curr: { jenis_pembayaran: string; total_harga: any; }) => {
            if (curr.jenis_pembayaran === "tunai") {
              acc.tunai = curr.total_harga;
            } else if(curr.jenis_pembayaran === "qr") {
              acc.qr = curr.total_harga;
            } else if(curr.jenis_pembayaran === "va") {
              acc.va = curr.total_harga;
            }
            return acc;
          }, { tunai: 0, non_tunai: 0 });
          console.log(data.dataTotal);
          setGraphicData({
            data: {
              labels: ['tunai', 'qris', 'va'],
              datasets: [
                {
                  label: 'Tunai',
                  data: labels.map(() => dataTotal.tunai || 0),
                  backgroundColor: '#219ebc',
                  barPercentage: 0.3,
                  categoryPercentage: 1,
                },
                {
                  label: 'QRIS',
                  data: labels.map(() => dataTotal.qris || 0),
                  backgroundColor: '#c1121f',
                  barPercentage: 0.3,
                  categoryPercentage: 1,
                },
                {
                  label: 'Virtual Account',
                  data: labels.map(() => dataTotal.va || 0),
                  backgroundColor: '#283618',
                  barPercentage: 0.3,
                  categoryPercentage: 1,
                },
              ],
            }
          });
          console.log(data.dataTotal);
          let total = parseInt(data.jumlah[0].total) - parseInt(data.cntCancel);
          setJumlahPenumpang(total.toString());
          setLoading(false);
        },
        ()=>{
          setLoading(false);
        }
      );
    } else {
      getPembayaranByJadwalAction(
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
          setDataPembayaran(data.dataTotal);
          setPagination({
              totalItems: data.cnt,
              totalPage: data.totalPage,
              currentPage: page || 1
          });
          setStatistik({
            cancel: data.cntCancel,
            real: data.jumlah[0].total
          });
          const dataTotal = data.dataTotal.reduce((acc: { tunai: any; qr: any; va: any; }, curr: { jenis_pembayaran: string; total_harga: any; }) => {
            if (curr.jenis_pembayaran === "tunai") {
              acc.tunai = curr.total_harga;
            } else if(curr.jenis_pembayaran === "qr") {
              acc.qr = curr.total_harga;
            } else if(curr.jenis_pembayaran === "va") {
              acc.va = curr.total_harga;
            }
            return acc;
          }, { tunai: 0, non_tunai: 0 });
          setGraphicData({
            data: {
              labels: ['tunai', 'qris', 'va'],
              datasets: [
                {
                  label: 'Tunai',
                  data: labels.map(() => dataTotal.tunai || 0),
                  backgroundColor: '#219ebc',
                  barPercentage: 0.3,
                  categoryPercentage: 1,
                },
                {
                  label: 'QRIS',
                  data: labels.map(() => dataTotal.qris || 0),
                  backgroundColor: '#c1121f',
                  barPercentage: 0.3,
                  categoryPercentage: 1,
                },
                {
                  label: 'Virtual Account',
                  data: labels.map(() => dataTotal.va || 0),
                  backgroundColor: '#283618',
                  barPercentage: 0.3,
                  categoryPercentage: 1,
                },
              ],
            }
          });
          let total = parseInt(data.jumlah[0].total) - parseInt(data.cntCancel);
          setJumlahPenumpang(total.toString());
          setLoading(false);
        },
        ()=>{
          setLoading(false);
        }
      );
    }
    setLoading(true);
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
          let ids = data.data.map((item: any) => item.id_jadwal);
          setListJadwal(ids)
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

  const handleDownloadM = () => {
    setLoading(true);
    let fileName = 'ManifestPembayaran_';
          if (isSameDate(dateRange.startDate || new Date(), dateRange.endDate || new Date())) {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + '.pdf';
          } else {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + "-" + parseDateToShortFormat(dateRange.endDate || new Date()) + '.pdf';
          }
    handleDownloadManifestPembayaran(
      {
          id_jadwal: selectedJadwal.value,
          tanggal: parseDateToBackendFormat(dateRange.startDate || new Date()),
          tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
          status_checker: 2,
          manifest: true
      },
      (data)=>{
          fileDownload(data, fileName);
          setLoading(false);
      },
      ()=>{
          setLoading(false);
      }
  );
  }

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

  const handleDocxDownload = async () => {
    let fileName = 'ManifestPenumpang_';
          if (isSameDate(dateRange.startDate || new Date(), dateRange.endDate || new Date())) {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + '.docx';
          } else {
            fileName = fileName + parseDateToShortFormat(dateRange.startDate || new Date()) + "-" + parseDateToShortFormat(dateRange.endDate || new Date()) + '.docx';
          }
    try {
      const content = await fetch('/PEMBAYARAN LIST.docx').then((response) => response.arrayBuffer());
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip);
      console.log(dataAll);
      doc.setData(dataAll);
      doc.render();
      const blob = doc.getZip().generate({ type: 'blob' });
      saveAs(blob, fileName);
    } catch (error) {
      console.error(error);
    }
  };

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
        <CustomBreadcumb noRoute title="Laporan Pembayaran"/>
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

        {/* <BaseCard>
            <div className='mb-4'>
                <span className='font-robotoregular text-md mr-8'>Total Pendapatan</span>
                <span className='font-robotomedium text-md'>Rp. {convertLabelToPrice(`${Number("0")}`)}</span>
            </div>
            <PembayaranChartLaporan
              pembayaran={dataPembayaran}
            />
        </BaseCard> */}
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
                  label='Download Laporan Manifest'
                  onClick={handleDownloadM}
                />
              </div>
              <div className='w-1/4'>
                <Button 
                  label='Download Laporan Jasa Sandar'
                  onClick={handleDownloadLapGT}
                />
              </div>
              <div className='w-1/4'>
                <Button 
                  label='Download Laporan Bongkar Muat'
                  onClick={handleDownloadLapJasa}
                />
              </div>
              <div className='w-1/4'>
                <Button 
                  label='Download Laporan Berita Acara'
                  onClick={handleDownloadLapBA}
                />
              </div>
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
                       <th className="text-sm font-robotomedium py-2">Alamat</th>
                       <th className="text-sm font-robotomedium py-2">Kode Booking</th>
                       <th className="text-sm font-robotomedium py-2">Tanggal Berangkat</th>
                       <th className="text-sm font-robotomedium py-2">Tujuan</th>
                       <th className="text-sm font-robotomedium py-2">Entry By</th>
                       <th className="text-sm font-robotomedium py-2">Metode</th>
                       <th className="text-sm font-robotomedium py-2">Bayar</th>
                       <th className="text-sm font-robotomedium py-2">Tanggal Bayar</th>
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
                               <td className="py-2">{item.alamat}</td>
                               <td className="py-2">{item.kode_booking}</td>
                               <td className="py-2">{parseDateIncludeHours(new Date(item.tanggal || ''), true)}</td>
                               <td className="py-2">{item.tujuan || '-'}</td>
                               <td className="py-2">{item.created_by || '-'}</td>
                               <td className="py-2">{jenisPembayaranSpawner(item.jenis_pembayaran) || '-'}</td>
                               {item.harga != undefined ? <td className="py-2">Rp. {convertLabelToPrice(item.harga)}</td> : <td className="py-2">Rp. 0</td>}
                               <td className="py-2">{parseDateIncludeHours(new Date(item.tanggal_bayar || ''), true)}</td>
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
