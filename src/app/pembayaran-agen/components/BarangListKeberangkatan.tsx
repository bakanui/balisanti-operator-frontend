import { IServiceOption } from "@/app/cetak-tiket/components/tiketTemplate";
import { CheckBox } from "@/app/components/CheckBox";
import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";

interface IProps {
    title: string;
    penumpang: IServiceOption[];
    selectPenumpang: (index: number)=> void;
    checkAll: boolean;
    setCheckAll: () => void;
}
export const BarangListKeberangkatan = (props: IProps) => {
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
                    <th className="text-sm font-robotomedium py-2">Jenis</th>
                    <th className="text-sm font-robotomedium py-2">Jumlah</th>
                </tr>
            </HeadTb>
            <tbody>
                {props.penumpang.map((item, index)=> {
                    return(
                        <TableRow key={index} strip={index%2 == 1}>
                            <td className="pl-4 py-2">
                                <CheckBox selected={item.selected} onClick={()=>props.selectPenumpang(index)} text=""/>
                            </td>
                            <td className="py-2">{item.nama_barang}</td>
                            <td className="py-2">{item.jenis_barang}</td>
                            <td className="py-2">{item.qty}</td>
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