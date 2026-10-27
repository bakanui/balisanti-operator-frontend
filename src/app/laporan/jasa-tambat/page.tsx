"use client";

import { useMemo, useState, useEffect, useRef } from 'react';
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { BaseContainer } from "@/app/components/Container";
import { TableFilter } from '@/app/components/TableFilter';
import { RangeDatePicker } from '@/app/components/RangeDatePicker';
import { CustomPagination } from '@/app/components/CustomPagination';
import { Loading } from '@/app/components/Loading';
import { Empty } from '@/app/components/Empty';
import { CustomTable, HeadTb, TableRow } from '@/app/components/MyTable';
import { getFirstAndLastDate, parseDateIncludeHours } from '@/app/utils/utility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import { Range } from 'react-date-range';
import { debounce } from 'lodash';
import { JasaTambatService } from './jasa-tambat.service';

export default function LaporanJasaTambat() {
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState({ value: 10, label: '10' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [dataList, setDataList] = useState<any[]>([]);

  const [dateRange, setDateRange] = useState<Range>({
    startDate: getFirstAndLastDate().first,
    endDate: getFirstAndLastDate().last,
    key: 'selection'
  });

  const debouncedSearch = useRef(
    debounce(async (e) => {
      setKeyword(e.target.value);
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const items = await JasaTambatService.fetchJasaTambat();
      setDataList(items);
    } catch (error) {
      console.error('Error fetching jasa tambat:', error);
      toast.error('Gagal mengambil data jasa tambat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset ke halaman pertama saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, limit.value, dateRange.startDate, dateRange.endDate]);

  // Memfilter data berdasarkan pencarian armada & periode tanggal
  const filteredData = useMemo(() => {
    let result = dataList;

    if (keyword) {
      result = result.filter(item => {
        const namaArmada = item.nama_armada || item.armada?.nama_armada || '';
        return namaArmada.toLowerCase().includes(keyword.toLowerCase());
      });
    }

    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter(item => {
        const itemDate = new Date(item.tanggal);
        return itemDate >= start && itemDate <= end;
      });
    }

    return result;
  }, [keyword, dateRange.startDate, dateRange.endDate]);

  const totalItems = filteredData.length;
  const totalPage = Math.ceil(totalItems / limit.value) || 1;

  // Membagi data per halaman (paginasi)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * limit.value;
    return filteredData.slice(startIndex, startIndex + limit.value);
  }, [filteredData, currentPage, limit.value]);

  // Statistik Ringkasan
  const totalRetribusi = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (Number(curr.jumlah_retribusi) || Number(curr.total_retribusi) || 0), 0);
  }, [filteredData]);

  const totalPenumpang = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (Number(curr.jumlah_penumpang) || Number(curr.total_penumpang) || 0), 0);
  }, [filteredData]);

  // Fungsi mendownload data baris sebagai file PDF dari backend
  const handleDownloadRow = async (item: any) => {
    try {
      toast.info('Sedang mendownload file...', { autoClose: 1000 });
      await JasaTambatService.downloadJasaTambat(item);
      toast.success(`Berhasil mendownload data ${item.nama_armada || item.armada?.nama_armada}!`);
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Gagal mendownload PDF dari server');
    }
  };


  return (
    <BaseContainer>
      <CustomBreadcumb noRoute title="Laporan Jasa Tambat" />

      {/* Date Filter Card */}
      <BaseCard>
        <div className="sm:grid gap-x-6 grid-cols-2">
          <RangeDatePicker
            label="Periode"
            date={dateRange}
            onChange={(date) => setDateRange(date)}
            onFilter={() => { }}
            filterText={'Filter Tanggal'}
          />
        </div>
      </BaseCard>

      <div className='mb-4' />

      {/* Summary Statistics Card */}
      <BaseCard>
        <div className='sm:grid gap-x-6 grid-cols-3 py-2'>
          <div>
            <span className='font-robotoregular text-md mr-4 text-slate-500'>Total Armada Tambat</span>
            <div className='font-robotomedium text-xl text-primary mt-1'>{filteredData.length} Kapal</div>
          </div>
          <div>
            <span className='font-robotoregular text-md mr-4 text-slate-500'>Total Retribusi</span>
            <div className='font-robotomedium text-xl text-primary mt-1'>Rp. {new Intl.NumberFormat('id-ID').format(totalRetribusi)}</div>
          </div>
          <div>
            <span className='font-robotoregular text-md mr-4 text-slate-500'>Total Penumpang</span>
            <div className='font-robotomedium text-xl text-primary mt-1'>{new Intl.NumberFormat('id-ID').format(totalPenumpang)} orang</div>
          </div>
        </div>
      </BaseCard>

      <div className='mb-4' />

      {/* Main Table Card */}
      <BaseCard>
        <TableFilter
          onChange={debouncedSearch}
          limitChange={(e) => setLimit({ value: parseInt(e.target.value, 10) || 10, label: e.target.value })}
        />

        {loading ? (
          <Loading loading={loading} title="Memuat Data Jasa Tambat" />
        ) : (
          <div className='overflow-x-scroll mt-4'>
            <CustomTable>
              <HeadTb>
                <tr>
                  <th className="text-sm font-robotomedium pl-4 py-2 w-[80px]">No</th>
                  <th className="text-sm font-robotomedium py-2">Tanggal</th>
                  <th className="text-sm font-robotomedium py-2">Nama Armada</th>
                  <th className="text-sm font-robotomedium py-2">Jumlah Retribusi</th>
                  <th className="text-sm font-robotomedium py-2">Jumlah Penumpang</th>
                  <th className="text-sm font-robotomedium py-2 pr-4 text-center w-[150px]">Aksi</th>
                </tr>
              </HeadTb>
              <tbody>
                {paginatedData.map((item, index) => {
                  const startingNumber = (currentPage - 1) * limit.value;
                  return (
                    <TableRow key={item.id} strip={index % 2 === 1}>
                      <td className="pl-4 py-3">{startingNumber + index + 1}</td>
                      <td className="py-3">{parseDateIncludeHours(new Date(item.tanggal), true)}</td>
                      <td className="py-3 font-robotomedium">{item.nama_armada || item.armada?.nama_armada}</td>
                      <td className="py-3">Rp. {new Intl.NumberFormat('id-ID').format(Number(item.jumlah_retribusi || item.total_retribusi || 0))}</td>
                      <td className="py-3">{item.jumlah_penumpang || item.total_penumpang || 0} orang</td>
                      <td className="py-3 pr-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDownloadRow(item)}
                            className="h-[28px] px-3 text-xs rounded-full font-robotoregular bg-primary text-white hover:bg-primary-dark flex items-center justify-center gap-1.5 transition-colors"
                            title="Download PDF"
                          >
                            <FontAwesomeIcon icon={faDownload} className="text-[10px]" />
                          </button>

                        </div>
                      </td>
                    </TableRow>
                  );
                })}
              </tbody>
            </CustomTable>

            {!loading && paginatedData.length === 0 && (
              <Empty title="Tidak ada data Jasa Tambat ditemukan" subtitle="Silakan pilih periode atau armada yang berbeda!" />
            )}

            <div className="mt-4">
              <CustomPagination
                totalItems={totalItems}
                totalPage={totalPage}
                onPageChange={(e) => setCurrentPage(e.selected + 1)}
                limit={limit.value}
                totalData={paginatedData.length}
                currentPage={currentPage}
              />
            </div>
          </div>
        )}
      </BaseCard>


      <ToastContainer />
    </BaseContainer>
  );
}
