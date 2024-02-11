"use client"
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { Button, LButton } from "@/app/components/Button";
import { TextWithLabel } from "../components/TextWithLabel";
import { Badge } from "@/app/components/Badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PricingTable } from "@/app/penjualan-tiket/components/PricingTable";
import { TextBetweenLabel } from "../components/TextBetweenLabel";
import { IPembayaranHistory, IPenumpang } from "@/app/types/jadwal";
import { IAgen } from "@/app/types/agen";
import { getInvoiceDetailAction } from "../pembayaran.service";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { convertLabelToPrice, parseDateIncludeHours, toastErrorConfig, toastSuccessConfig } from "@/app/utils/utility";
import { setStorageValue } from "@/app/utils/localstoreage";
import { TransactionHistory } from "../components/TransactionHistory";
import { toast, ToastContainer } from "react-toastify";
import { BaseCard } from "@/app/components/BaseCard";
import { Empty } from "@/app/components/Empty";
import { PenumpangList } from "../components/PenumpangList";
import { cetakTiket } from "@/app/penjualan-tiket/penjualanTiket.service";
import Link from 'next/link';

export default function DetailInvoice() {
  const router = useRouter();
  const queryParams: any = useSearchParams();
  const [summaryTabel, setSummaryTabel] = useState([]);
  const [total, setTotal] = useState(0);
  const [agen, setAgen] = useState<IAgen | null>(null);
  const [history, setHistory] = useState<IPembayaranHistory[]>([]);
  const [jenisPerjalanan, setjenisPerjalanan] = useState<'sekali_jalan' | 'pulang_pergi'>('sekali_jalan');
  const [pembayaran, setPembayaran] = useState({
    sisa_tagihan: 0,
    sudah_bayar: 0,
    total_tagihan: 0,
    status_lunas: ''
  });
  const [collect, setCollect] = useState(0);
  const [penumpang, setPenumpang] = useState<IPenumpang[]>([]);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState('');
  const [jenisTiket, setJenisTiket] = useState('');
  const [isNotFound, setIsNotFound] = useState(false);
  
  useEffect(()=> {
    getData();
  }, []);
  
  useEffect(() => {
      if (typeof window !== 'undefined') {
          // add key nama_agen and collect to penumpang
          const tmp = penumpang.map((item) => {
              return {
                  ...item,
                  nama_agen: agen?.nama_agen,
                  collect: collect
              }
          });
          (window as any).printTicket = JSON.stringify(tmp);
      }
    }, [penumpang])

  // set nama agen as global variable, can access through window
  useEffect(() => {
      if (typeof window !== 'undefined') {
          (window as any).nama_agen = JSON.stringify(agen?.nama_agen);
      }
  }, [agen]);

  const tiketDispenser = () => {
    penumpang?.map((item, index)=> {
      setLoading(true);
      cetakTiket(
          {
            agen: agen?.nama_agen ? agen.nama_agen : "-",
            kode_booking: item.kode_booking,
            date: item.tanggal,
            rute_from: "Pelabuhan " + item.dermaga_awal,
            rute_to: "Pelabuhan " + item.dermaga_tujuan,
            nama: item.nama_penumpang,
            qrcode: item.qrcode
          },
          (data) => {
            setLoading(false);
            router.replace('/penjualan-tiket');
          },
          (err) => {
              setLoading(false);
              toast.error(err, toastErrorConfig);
          },
      );
    });
  };

  const getData = (page?: number) => {
      if (page && typeof page != 'number') {
          page = 1;
      }
      setLoading(true);
      getInvoiceDetailAction(
          queryParams.get('id'),
          (data)=>{
              if (data.data.length == 0) {
                  setIsNotFound(true);
                  setLoading(false);
                  return;
              }
              setAgen(data.agen);
              setPenumpang(data.penumpang);
              setJenisTiket(data.penumpang[0].tipe_penumpang + " - " + data.penumpang[0].jenis_penumpang);
              setPembayaran({
                sisa_tagihan: data.pembayaran.sisa_tagihan,
                sudah_bayar: data.pembayaran.sudah_bayar,
                total_tagihan: data.pembayaran.total_tagihan,
                status_lunas:  data.pembayaran.status_lunas
              });
              setHistory(data.history);
              setLink('http://localhost/bali-santi-printer/?kode_booking='+ data.penumpang[0].kode_booking + '&jenis_tiket=' + data.penumpang[0].tipe_penumpang + " - " + data.penumpang[0].jenis_penumpang + '&tanggal=' + data.penumpang[0].waktu_berangkat + '&rute_from=' + data.penumpang[0].dermaga_awal + '&rute_to=' + data.penumpang[0].dermaga_tujuan + '&total=' + data.pembayaran.total_tagihan);
              let tempJenisPerjalanan = false;
              console.log(data.data.map((item: any, index: number)=> {
                return {
                  keterangan: 'Tiket',
                }
              }));
              const tiket = data.data.map((item: any, index: number)=> {
                return {
                  id: new Date().getTime(),
                  keterangan: 'Tiket',
                  jenisPenumpang: { value: item.jenis_penumpang, label: item.jenis_penumpang },
                  qty: item.jumlah_tiket,
                  tarif: item.harga_tiket,
                  subtotal: item.diskon_agen !== null ? item.subtotal_tiket - item.diskon_agen : item.subtotal_tiket,
                  harga_service: item.harga_service,
                  jumlah_service: item.jumlah_service,
                  diskon: 'Rp. '+  convertLabelToPrice(item.diskon_agen !== null ? item.diskon_agen : "0")
                }
              });
              console.log(tiket);
              // penjemputan
              if (tiket.length > 0) {
                const temp = tiket[0],
                totTiket = tiket.reduce((acc: any, next: any)=> {
                  return acc + next.qty
                }, 0),
                totService = tiket.reduce((acc: any, next: any)=> {
                  return acc + parseInt(next.jumlah_service)
                }, 0),
                service = {
                  id: new Date().getTime(),
                  keterangan: 'Penjemputan',
                  jenisPenumpang: { value: '-', label: '-' },
                  qty: totService,
                  tarif: temp.harga_service,
                  // subtotal: tempJenisPerjalanan ? totTiket/2 * temp.harga_service :  totTiket * temp.harga_service,
                  subtotal: totService * temp.harga_service,
                  diskon: '-'
                };
                tiket.push(service);
              }
              if (tempJenisPerjalanan) {
                setjenisPerjalanan('pulang_pergi');
              }
              if (!tempJenisPerjalanan) {
                setjenisPerjalanan('sekali_jalan');
              }
              setTotal(data.pembayaran.total_tagihan);
              setSummaryTabel(tiket);
              if(data.collect){
                    setCollect(data.collect.jumlah);
                } else {
                    setCollect(0);
                }
              setLoading(false);
          },
          ()=>{
              setLoading(false);
          }
      );
  }

  const gotoPembayaran = () => {
    setStorageValue('tagihan', pembayaran);
    router.push('/pembayaran-agen/pembayaran?invoice='+queryParams.get('id'));
  }

  const back = () => {
    router.back();
  }

  if (isNotFound) {
    return(
      <BaseContainer>
        <CustomBreadcumb onBack={back} title="Detail Invoice"/>
        <BaseCard>
          <Empty
            title="Invoice Tidak Ditemukan"
            subtitle="Periksa dan Pastikan Nomor Invoice sudah benar!"
          />
        </BaseCard>
      </BaseContainer>
    );
  }

  return(
    <BaseContainer>
        <CustomBreadcumb onBack={back} title="Detail Invoice"/>
        <div className="my-4 relative flex justify-between">
          <div className="w-full h-auto mr-4 bg-white p-2 sm:p-8 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="text-lg font-robotobold mr-4">INVOICE</div>
                  <div className="h-{30px}">
                    <Badge
                      text={pembayaran.status_lunas == 'Lunas' ? 'Lunas' : 'Belum Lunas'}
                      status={pembayaran.status_lunas == 'Lunas'}
                    />
                  </div>
                </div>
                
                {/* <div className="w-[150px]">
                  <LButton 
                    label="Download Invoice"
                    outline
                    href={`https://backend.wahanavirendra.id/api/pembayaran/download-invoice-pdf?no_invoice=${queryParams.get('id')}`}
                  />
                </div> */}

                <div className="w-[150px]">
                  <Link href="" onClick={tiketDispenser}>
                      <button className="h-[48px] w-full text-sm rounded-lg font-robotoregular border-solid border-2 border-primary hover:bg-slate-200 dark:text-black">Cetak Tiket</button>
                  </Link>
                </div>
                
              </div>
              <div className="sm:grid gap-x-6 grid-cols-3 mt-6">
                  <TextWithLabel
                    title="No Invoice"
                    value={queryParams.get('id')}
                    size="sm"
                  />
                  <TextWithLabel 
                    title="Tanggal"
                    value={history.length > 0 ? parseDateIncludeHours(new Date(history[0].created_at), true) : '-'}
                    size="sm"
                  />
                  <TextWithLabel 
                    title="Nama Agen"
                    value={agen ? agen.nama_agen : '-'}
                    size="sm"
                  />
              </div>

              <div className="sm:grid gap-x-6 grid-cols-3 mt-6">
                  <TextWithLabel
                    title="Dermaga Asal"
                    value={penumpang.length > 0 ? penumpang[0].dermaga_awal : '-'}
                    size="sm"
                  />
                  <TextWithLabel 
                    title="Dermaga Tujuan"
                    value={penumpang.length > 0 ? penumpang[0].dermaga_tujuan : '-'}
                    size="sm"
                  />
                  <TextWithLabel 
                    title="Nama Kapal"
                    value={penumpang.length > 0 ? penumpang[0].nama_kapal: '-'}
                    size="sm"
                  />
              </div>
              <div className="sm:grid gap-x-6 grid-cols-3 mt-6">
                  <TextWithLabel 
                    title="Waktu Keberangkatan"
                    value={penumpang.length > 0 ? penumpang[0].waktu_berangkat +' WITA' : '-'}
                    size="sm"
                  />
              </div>

              <div className="mt-6"/>
              <PenumpangList 
                penumpang={penumpang}
                title="Penumpang"
              />
              <div className="mt-6"/>
              <PricingTable 
                summaryTabel={summaryTabel}
                total={total}
                title="Detail Tagihan"
                jenisPerjalanan={jenisPerjalanan}
              />
              </div>
          <div className="min-w-[250px]">
              <div className="w-full h-auto mr-4 bg-white p-2 sm:p-8 rounded-xl">
                  <div className="text-lg font-robotobold mr-4 mb-3">Tagihan</div>
                  <TextBetweenLabel 
                    title="Total Tagihan"
                    prefix="Rp."
                    sufix={convertLabelToPrice(`${pembayaran.total_tagihan}`)}
                  />
                  {collect > 0 ? (
                    <>
                    <div className="mb-3"/>
                    <TextBetweenLabel 
                      title="Collect"
                      prefix="Rp."
                      sufix={convertLabelToPrice(`${collect}`)}
                    />
                    </>
                  ): null}
                  <div className="mb-3"/>
                  <TextBetweenLabel 
                    title="Sudah Dibayarkan"
                    prefix="Rp."
                    sufix={convertLabelToPrice(`${pembayaran.sudah_bayar}`)}
                  />
                  <div className="mb-3"/>
                  <TextBetweenLabel 
                    title="Terhutang"
                    prefix="Rp."
                    sufix={convertLabelToPrice(`${pembayaran.sisa_tagihan}`)}
                  />
                  <div className="mb-6"/>
                  {pembayaran.status_lunas != 'Lunas' ? 
                    <Button 
                      label="Pembayaran"
                      onClick={gotoPembayaran}
                    />
                  : null}
              </div>
              {/* transaction history */}
              <div className="w-full h-auto mr-4 bg-white p-2 sm:p-8 rounded-xl mt-4">
                  <TransactionHistory 
                    history={history}
                  />
              </div>
          </div>
        </div>
        <LoadingOverlay 
          loading={loading}
          title="Memuat Data"
        />
        <ToastContainer />
    </BaseContainer>
  );
}
