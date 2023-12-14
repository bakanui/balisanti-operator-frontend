import { CheckBox } from "@/app/components/CheckBox";
import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { IPenumpang } from "@/app/types/jadwal";

export type IPenumpangOption = Partial<IPenumpang>
   & { selected: boolean }
interface IProps {
    title: string;
    penumpang: IPenumpangOption[];
    selectPenumpang: (index: number)=> void;
    checkAll: boolean;
    setCheckAll: () => void;
}
export const PenumpangListKeberangkatan = (props: IProps) => {
    return(
        <>
        <span className="font-robotomedium text-base">{props.title || 'Total Pembayaran'}</span>
        <CustomTable>
            <HeadTb>
                <tr>
                    <th className="text-sm font-robotomedium pl-4 py-2">
                        <CheckBox selected={props.checkAll} onClick={props.setCheckAll} text=""/>
                    </th>
                    <th className="text-sm font-robotomedium py-2">Nama</th>
                    <th className="text-sm font-robotomedium py-2">No. Identitas</th>
                    <th className="text-sm font-robotomedium py-2">Waktu Keberangkatan</th>
                    <th className="text-sm font-robotomedium py-2">Kapal</th>
                </tr>
            </HeadTb>
            <tbody>
                {props.penumpang.map((item, index)=> {
                    return(
                        <TableRow key={index} strip={index%2 == 1}>
                            <td className="pl-4 py-2">
                                <CheckBox selected={item.selected} onClick={()=>props.selectPenumpang(index)} text=""/>
                            </td>
                            <td className="py-2">{item.nama_penumpang}</td>
                            <td className="py-2">{item.no_identitas}</td>
                            <td className="py-2">{item.waktu_berangkat} WITA</td>
                            <td className="py-2">{item.nama_kapal}</td>
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