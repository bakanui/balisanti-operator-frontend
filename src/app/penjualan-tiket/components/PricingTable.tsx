import { CustomTable, HeadTb, TableRow } from "@/app/components/MyTable";
import { convertLabelToPrice} from "@/app/utils/utility";

interface IProps {
    summaryTabel: any[];
    total: number;
    title?: string;
    jenisPerjalanan?: 'sekali_jalan' | 'pulang_pergi';
}
export const PricingTable = (props: IProps) => {
    console.log('SERVICES = ', props.summaryTabel);
    
    return(
        <>
        <span className="font-robotomedium text-base">{props.title || 'Total Pembayaran'}</span>
        <CustomTable>
            <HeadTb>
                <tr>
                    <th className="text-sm font-robotomedium pl-4 py-2">No</th>
                    <th className="text-sm font-robotomedium py-2">Keterangan</th>
                    <th className="text-sm font-robotomedium py-2">Jenis Penumpang</th>
                    <th className="text-sm font-robotomedium py-2">Qty</th>
                    <th className="text-sm font-robotomedium py-2">Tarif</th>
                    <th className="text-sm font-robotomedium py-2">Diskon</th>
                    <th className="text-sm font-robotomedium py-2">Subtotal</th>
                </tr>
            </HeadTb>
            <tbody>
                {props.summaryTabel.map((item, index)=> {
                    return(
                        <TableRow key={index} strip={index%2 == 1}>
                            <td className="pl-4 py-2">{index+1}</td>
                            <td className="py-2">{item.keterangan} {item.keterangan == 'Tiket' && props.jenisPerjalanan == 'pulang_pergi' ? <span className="font-robotoregular text-primary"> - (Pulang Pergi)</span> : null}</td>
                            <td className="py-2">{item.jenisPenumpang.value ? item.jenisPenumpang.label : '-'}</td>
                            <td className="py-2">{item.qty}</td>
                            <td className="py-2">Rp. {convertLabelToPrice(`${item.tarif}`)}</td>
                            <td className="py-2">{item.diskon ? item.diskon : '-'}</td>
                            <td className="py-2">Rp. {convertLabelToPrice(`${item.subtotal}`)}</td>
                        </TableRow>
                    );
                })}
                <tr className="text-sm font-robotoregular border border-[black] border-x-0">
                    <td className="pl-4 py-2"></td>
                    <td colSpan={4} className="font-robotobold text-lg">TOTAL</td>
                    <td className="text-lg py-1 font-robotobold">Rp. {convertLabelToPrice(`${props.total}`)}</td>
                </tr>
            </tbody>
        </CustomTable>
        </>
    );
}