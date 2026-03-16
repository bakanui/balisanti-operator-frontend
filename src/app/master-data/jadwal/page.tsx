'use client'
import { Badge } from "@/app/components/Badge";
import { BaseCard } from "@/app/components/BaseCard";
import { CustomBreadcumb } from "@/app/components/Breadcumb";
import { ActionButton, Button } from "@/app/components/Button";
import { BaseContainer } from "@/app/components/Container";
import { CustomPagination } from "@/app/components/CustomPagination";
import { Empty } from "@/app/components/Empty";
import { Loading } from "@/app/components/Loading";
import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { TableFilter } from "@/app/components/TableFilter";
import { IJadwal } from "@/app/types/jadwal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { getjadwalAction } from "./jadwal.service";

export default function Jadwal(){
    const router = useRouter();
    const [data, setData] = useState<IJadwal[]>([]);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPage: 0,
        currentPage: 1
    });
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [limit, setLimit] = useState({value: 10, label: '10'});

    const debouncedSearch = useRef(
        debounce(async (e) => {
            setKeyword(e.target.value);
        }, 500)
    ).current;

    useEffect(()=>{
        getData(1);
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
        getjadwalAction(
            {
                limit: limit.value,
                nama: keyword,
                pagenumber: page || 1.
            },
            (data)=>{
                setData(data.data);
                setPagination({
                    totalItems: data.cnt,
                    totalPage: data.totalPage,
                    currentPage: page || 1
                });
                setLoading(false);
            },
            ()=>{
                setLoading(false);
            },
            ()=> { router.replace('/login') }
        );
    }

    const gotoTambah = () => {
        router.push('/master-data/jadwal/tambah');
    }

    const gotoEdit = (id: string) => {
        router.push('/master-data/jadwal/edit?id='+id);
    }

    return(
        <BaseContainer>
            <CustomBreadcumb title="Jadwal Berlayar"/>
            <BaseCard>
            
                <div className="w-[220px] mb-4">
                    <Button 
                        label="Tambah Jadwal Berlayar"
                        icon={faPlus}
                        onClick={gotoTambah}
                    />
                </div>
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
                            <th className="text-sm font-robotomedium py-2">Nahkoda</th>
                            <th className="text-sm font-robotomedium py-2">Kapal</th>
                            <th className="text-sm font-robotomedium py-2">Keberangkatan</th>
                            <th className="text-sm font-robotomedium py-2">Tujuan</th>
                            <th className="text-sm font-robotomedium py-2">Waktu</th>
                            <th className="text-sm font-robotomedium py-2">Jenis</th>
                            <th className="text-sm font-robotomedium py-2">Loket</th>
                            <th className="text-sm font-robotomedium py-2">Status</th>
                            <th className="text-sm font-robotomedium py-2">Aksi</th>
                        </tr>
                    </HeadTb>
                    <tbody>
                    {data.length > 0 ? data.map((item, index)=> {
                        let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit.value;
                        return(
                            <TableRow key={item.id} strip={index%2 == 1}>
                                <td className="pl-4 py-2">{startingNumber+index+1}</td>
                                <td className="py-2">{item.nama_nahkoda}</td>
                                <td className="py-2">{item.nama_kapal}</td>
                                <td className="py-2">{item.rute?.nama_dermaga_awal}</td>
                                <td className="py-2">{item.rute?.nama_dermaga_tujuan}</td>
                                <td className="py-2">{item.waktu_berangkat}</td>
                                <td className="py-2">{item.jenis_jadwal}</td>
                                <td className="py-2">{item.rute?.nama_dermaga_awal}</td>
                                <td className="py-2">
                                    <Badge 
                                       text={item.status_jadwal == 1 ? 'Aktif' : 'Tidak Aktif'}
                                       status={item.status_jadwal == 1}
                                    />
                                </td>
                                <td className="py-2 pr-2">
                                    <div>
                                        <ActionButton 
                                            label="Aksi"
                                            outline={true}
                                            hideDelete={true}
                                            onEdit={()=>gotoEdit(item.id_jadwal)}
                                        />
                                    </div>
                                </td>
                            </TableRow>
                        );
                    }): ''}
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
        </BaseContainer>
    );
}