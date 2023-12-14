import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { IPenumpang } from "@/app/types/jadwal";

interface IProps {
    title: string;
    penumpang: IPenumpang[];
}
export const PenumpangList = (props: IProps) => {
    return(
        <>
        <span className="font-robotomedium text-base">{props.title || 'Total Pembayaran'}</span>
        <CustomTable>
            <HeadTb>
                <tr>
                    <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                    <th className="text-sm font-robotomedium py-2">Nama</th>
                    <th className="text-sm font-robotomedium py-2">No. Identitas</th>
                    <th className="text-sm font-robotomedium py-2">Jenis Kelamin</th>
                    <th className="text-sm font-robotomedium py-2">Email</th>
                </tr>
            </HeadTb>
            <tbody>
                {props.penumpang.map((item, index)=> {
                    return(
                        <TableRow key={index} strip={index%2 == 1}>
                            <td className="pl-4 py-2">{index+1}</td>
                            <td className="py-2">{item.nama_penumpang}</td>
                            <td className="py-2">{item.no_identitas}</td>
                            <td className="py-2">{item.jenis_kelamin == 'l' ? 'Laki-laki' : 'Perempuan'}</td>
                            <td className="py-2">{item.email}</td>
                        </TableRow>
                    );
                })}
                <tr className="border border-[black] border-x-0">
                </tr>
            </tbody>
        </CustomTable>
        </>
    );
}