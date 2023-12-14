"use client"
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { SecondaryDatePicker } from '@/app/components/SecondaryDatePicker';
import { ActionButton } from "@/app/components/Button";
import { TextWithLabel } from "./components/TextWithLabel";
import { TableFilter } from "@/app/components/TableFilter";
import { CustomTable, HeadTb, TableRow } from "../components/MyTable";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { getPembayaranAgenAction, getRekapTagihanAction } from "./pembayaran.service";
import { IPembayaranAgen, IRekapTagihan } from "../types/jadwal";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { toast, ToastContainer } from "react-toastify";
import { start } from "repl";
import { convertLabelPriceToNumeberPrice, convertLabelToPrice, getFirstAndLastDate, parseDateToBackendFormat, toastErrorConfig } from "../utils/utility";
import { Loading } from "../components/Loading";
import { Empty } from "../components/Empty";
import { CustomPagination } from "../components/CustomPagination";
import { RangeDatePicker } from "../components/RangeDatePicker";
import { Range } from "react-date-range";

export default function LaporanAgen() {
    const router = useRouter();
    const [data, setData] = useState<IPembayaranAgen[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
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
    const [rekapTagihan, setRekapTagihan] = useState<IRekapTagihan>({
        terhutang: '0',
        total_tagihan: '0',
        sudah_dibayarkan: '0'
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

    const getData = (page?: number) => {
        if (page && typeof page != 'number') {
            page = 1;
        }
        setLoading(true);
        getPembayaranAgenAction(
            {
                limit: limit.value,
                nama: keyword,
                tanggal_awal: parseDateToBackendFormat(dateRange.startDate || new Date()),
                tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
                pagenumber: page || 1
            },
            (data)=>{
                setData(data.data);
                setPagination({
                    totalItems: data.cnt,
                    totalPage: data.totalPage,
                    currentPage: page || 1
                });
                getRekapTagihanAction(
                    {
                        tanggal_awal: parseDateToBackendFormat(dateRange.startDate || new Date()),
                        tanggal_akhir: parseDateToBackendFormat(dateRange.endDate || new Date()),
                    },
                    (data)=>{
                        setLoading(false);
                        if (data.data.length > 0) {
                            setRekapTagihan({
                                terhutang: data.data[0].terhutang || '0',
                                sudah_dibayarkan: data.data[0].sudah_dibayarkan || '0',
                                total_tagihan: data.data[0].total_tagihan || '0'
                            });
                        }
                    },
                    (err)=>{
                        setLoading(false);
                        toast.error(err, toastErrorConfig);
                    },
                    ()=>{
                        router.replace('/login')
                    }
                );
            },
            ()=>{
                setLoading(false);
            }
        );
    }

    const gotoDetailAgen = (id: number) => {
        router.push('/pembayaran-agen/detail?id='+id);
    }

    return(
        <BaseContainer>
            <CustomBreadcumb noRoute title="Laporan Agen"/>
            <BaseCard>
                <div className="sm:grid gap-x-6 grid-cols-2">
                    <RangeDatePicker 
                        label="Periode"
                        date={dateRange}
                        onChange={(date)=> setDateRange(date)}
                        onFilter={getData}
                    />
                </div>
                <div className="sm:grid gap-x-6 grid-cols-3 mt-6">
                <TextWithLabel 
                    title="Total Tagihan"
                    value={`Rp. ${convertLabelToPrice(rekapTagihan.total_tagihan)}`}
                    color={"#008AA1"}
                    type='primary'
                />
                <TextWithLabel 
                    title="Sudah Dibayarkan"
                    value={`Rp. ${convertLabelToPrice(rekapTagihan.sudah_dibayarkan)}`}
                    color="#48CF8E"
                    type="success"
                />
                <TextWithLabel 
                    title="Terhutang"
                    value={`Rp. ${convertLabelToPrice(rekapTagihan.terhutang)}`}
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
                                <th className="text-sm font-robotomedium py-2">Nama Agen</th>
                                <th className="text-sm font-robotomedium py-2">Tagihan</th>
                                <th className="text-sm font-robotomedium py-2">Sisa Hutang</th>
                            </tr>
                        </HeadTb>
                        <tbody>
                            {data.map((item, index)=> {
                                let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit.value;
                                return(
                                    <TableRow key={item.id} onClick={()=>gotoDetailAgen(item.id)} strip={index%2 == 1}>
                                        <td className="pl-4 py-2">{startingNumber+index+1}</td>
                                        <td className="py-2">{item.nama_agen}</td>
                                        <td className="py-2">Rp. {convertLabelToPrice(`${item.tagihan}`)}</td>
                                        <td className="py-2">Rp. {convertLabelToPrice(`${item.sisa_limit}`)}</td>
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
            <ToastContainer/>
        </BaseContainer>
    );
}
