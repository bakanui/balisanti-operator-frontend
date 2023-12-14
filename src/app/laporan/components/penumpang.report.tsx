import { HeadTb, TableRow } from "@/app/components/MyTable";
import { IPenumpangOption } from "@/app/pembayaran-agen/components/PenumpangListKeberangkatan";
import { parseDateIncludeHours } from "@/app/utils/utility";
import React from "react";
import { IPagination } from "../penumpang/page";

interface IProps {
    data: any[];
    pagination: IPagination;
    limit: number;
}

const PenumpangToPrint = React.forwardRef((props: IProps, ref: any) => {
    const { data, pagination, limit } = props;
    return (
        <div ref={ref} id="penumpang-print">
            <table className="border-collapse w-full p-8 my-4 text-left">
                <HeadTb>
                    <tr>
                        <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                        <th className="text-sm font-robotomedium py-2">Nama Penumpang</th>
                        {/* <th className="text-sm font-robotomedium py-2">Email</th> */}
                        <th className="text-sm font-robotomedium py-2">Kode Booking</th>
                        <th className="text-sm font-robotomedium py-2">Jenis Kelamin</th>
                        <th className="text-sm font-robotomedium py-2">Tanggal Keberangkatan</th>
                        {/* <th className="text-sm font-robotomedium py-2">Waktu Keberangkatan</th> */}
                        <th className="text-sm font-robotomedium py-2">Agen</th>
                        <th className="text-sm font-robotomedium py-2">Service</th>
                        <th className="text-sm font-robotomedium py-2">Manifest</th>
                        <th className="text-sm font-robotomedium py-2">Entry By</th>
                    </tr>
                </HeadTb>
                <tbody>
                {data.map((item, index)=> {
                        let startingNumber = pagination.currentPage === 1 ? 0 : (pagination.currentPage-1)*limit;
                        return(
                            <TableRow key={item.id} strip={index%2 == 1}>
                                <td className="pl-4 py-2">{startingNumber+index+1}</td>
                                <td className="py-2">{item.nama_penumpang}</td>
                                {/* <td className="py-2">{item.email}</td> */}
                                <td className="py-2">{item.kode_booking}</td>
                                <td className="py-2">{item.jenis_kelamin == 'l' ? 'Laki-laki' : 'Perempuan'}</td>
                                <td className="py-2">{parseDateIncludeHours(new Date(item.tanggal || ''), true)}</td>
                                {/* <td className="py-2">{item.waktu_berangkat} WITA</td> */}
                                <td className="py-2">{item.nama_agen || '-'}</td>
                                <td className="py-2">{item.service || '-'}</td>
                                <td className="py-2">
                                {item.status_manifest}
                                </td>
                                <td className="py-2">{item.created_by || '-'}</td>
                            </TableRow>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
  });

  PenumpangToPrint.displayName = 'PenumpangToPrint';
  export default PenumpangToPrint;