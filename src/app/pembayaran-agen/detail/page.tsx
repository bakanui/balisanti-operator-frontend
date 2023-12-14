"use client"
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { TableFilter } from "@/app/components/TableFilter";
import { TextWithLabel } from "../components/TextWithLabel";
import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { Badge } from "@/app/components/Badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IInvoice } from "@/app/types/jadwal";
import { debounce } from "lodash";
import { getListInvoiceAgenAction } from "../pembayaran.service";
import { Loading } from "@/app/components/Loading";
import { IAgen } from "@/app/types/agen";
import { Empty } from "@/app/components/Empty";
import { CustomPagination } from "@/app/components/CustomPagination";
import { convertLabelToPrice, parseDateIncludeHours } from "@/app/utils/utility";
import { CheckBox } from "@/app/components/CheckBox";
import { Button } from "@/app/components/Button";
import { useDownloadMultipleInvoice } from "@/hooks/invoice.hook";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { toast, ToastContainer } from "react-toastify";

export default function DetailAgen() {
  const router = useRouter();
  const queryParams: any = useSearchParams();
  const [data, setData] = useState<IInvoice[] | any[]>([]);
  const [agen, setAgen] = useState<IAgen | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
      totalItems: 0,
      totalPage: 0,
      currentPage: 1
  });
  const [recap, setRecap] = useState({
      "total_tagihan": 0,
      "sudah_dibayarkan": 0,
      "terhutang": 0
  });
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState({value: 10, label: '10'});
  const [downloadInvoice, setDownloadInvoice] = useState(false);
  const [invoiceToDownload, setInvoiceToDownload] = useState<string[]>([]);
  const [download, loadingDownload] = useDownloadMultipleInvoice();

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

const getData = (page?: number) => {
    if (page && typeof page != 'number') {
        page = 1;
    }
    else if (page) {
      page = page + 1;
    }
    setLoading(true);
    getListInvoiceAgenAction(
        queryParams.get('id'),
        {
            limit: limit.value,
            nama: keyword,
            pagenumber: page || 1
        },
        (data)=>{
            setData(data.data);
            setAgen(data.agen);
            if (data.recap.length > 0) {
              setRecap({
                sudah_dibayarkan: data.recap[0].sudah_dibayarkan,
                terhutang: data.recap[0].terhutang,
                total_tagihan: data.recap[0].total_tagihan
              });
            }
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

  const gotoDetailInvoice = (id: string) => {
    router.push('/pembayaran-agen/detail-invoice?id='+id);
  }

  const back = () => {
    router.back();
  }

  const handleDownload = () => {
    setDownloadInvoice(true);
  }

  const checkInvoice = (invoiceNumber: string) => {
    const tmp = [...invoiceToDownload],
    tmpFilter = tmp.includes(invoiceNumber);
    if(tmpFilter) {
      setInvoiceToDownload(invoiceToDownload.filter((item)=> item != invoiceNumber));
      return;
    }
    setInvoiceToDownload([...invoiceToDownload, invoiceNumber]);
  }

  const cancelDownload = () => {
    setDownloadInvoice(false);
    setInvoiceToDownload([]);
  }

  const continueDownload = () => {
    if (invoiceToDownload.length == 0) {
      toast.error('Silakan pilih invoice terlebih dahulu!');
      return;
    }
    const invoiceNumbers = invoiceToDownload.join(',');
    download(invoiceNumbers);
  }

  return(
    <BaseContainer>
        <CustomBreadcumb onBack={back} title="Detail Agen"/>
        <BaseCard>
            <TextWithLabel
                title="Nama Agen"
                value={agen ? agen?.nama_agen : '-'}
                color={"#008AA1"}
                />
            <div className="sm:grid gap-x-6 grid-cols-3 mt-6">
              <TextWithLabel
                title="Total Tagihan"
                value={`Rp ${convertLabelToPrice(`${recap.total_tagihan}`)}`}
                color={"#008AA1"}
                type='primary'
              />
              <TextWithLabel 
                title="Sudah Dibayarkan"
                value={`Rp ${convertLabelToPrice(`${recap.sudah_dibayarkan}`)}`}
                color="#48CF8E"
                type="success"
              />
              <TextWithLabel 
                title="Terhutang"
                value={`Rp ${convertLabelToPrice(`${recap.terhutang}`)}`}
                color="#EA4335"
                type="danger"
              />
            </div>
        </BaseCard>
        <div className='mb-4'/>

        <BaseCard>
            <TableFilter 
                onChange={debouncedSearch}
                limitChange={(e)=>setLimit({value: e.target.value, label: e.target.value})}
            />
            {downloadInvoice ? 
            <>
            <div className='w-1/3 flex mt-2'>
                <div className="w-1/2">
                  <Button
                    label='Lanjut Download'
                    onClick={continueDownload}
                  />
                </div>
                <div className="w-1/2 ml-2">
                  <Button
                    label='Batal'
                    onClick={cancelDownload}
                    outline
                  />
                </div>
            </div>
            <div className="mt-2 text-xs font-bold font-robotomedium text-primary">*Silakan klik pada invoice untuk memilih</div>
            </>
            :
            <div className='w-1/3 flex mt-2'>
                <div className="w-1/2">
                  <Button
                    label='Download Invoice'
                    onClick={handleDownload}
                  />
                </div>
            </div>
            }
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
                    {downloadInvoice && <td className="pl-2">Aksi</td>}
                    <th className="text-sm font-robotomedium pl-2 py-2">No</th>
                    <th className="text-sm font-robotomedium py-2">No. Invoice</th>
                    <th className="text-sm font-robotomedium py-2">Tanggal Invoice</th>
                    <th className="text-sm font-robotomedium py-2">Nominal</th>
                    <th className="text-sm font-robotomedium py-2">Status</th>
                </tr>
            </HeadTb>
            <tbody>
              {data.map((item, index)=> {
                let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit.value;
                return(
                  <TableRow key={item.no_invoice} onClick={()=> downloadInvoice ? checkInvoice(item.no_invoice) : gotoDetailInvoice(item.no_invoice)} strip={index%2 == 1}>
                        {downloadInvoice ? 
                          <td className="pl-2 py-2">
                              <CheckBox selected={invoiceToDownload.includes(item.no_invoice)} onClick={()=>checkInvoice(item.no_invoice)} text=""/>
                          </td>
                        : null}
                        <td className="pl-4 py-2 bg-red">{startingNumber+index+1}</td>
                        <td className="py-2">{item.no_invoice}</td>
                        <td className="py-2">{parseDateIncludeHours(new Date(item.tanggal_invoice), true)}</td>
                        <td className="py-2">Rp. {convertLabelToPrice(`${item.nominal}`)}</td>
                        <td className="py-2">
                          <Badge
                              text={item.flag_lunas == 0 ? 'Belum Lunas' : 'Lunas'}
                              status={item.flag_lunas == 1}
                          />
                        </td>
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
          loading={loadingDownload}
          title="Mendownload Invoice"
        />
        <ToastContainer />
    </BaseContainer>
  );
}
