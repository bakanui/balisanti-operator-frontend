import { IHargaService } from "@/app/types/hargaService";

interface ICalculateServiceProps {
    serviceInfo: IHargaService[];
    tambahanService: any;
    summaryTabel: any;
    jenisPerjalanan: 'sekali_jalan' | 'pulang_pergi';
}
export interface ISummary {
    summary: any[];
    total: number;
}
export const calculateService = (props: ICalculateServiceProps) => {
    const {serviceInfo, tambahanService, summaryTabel, jenisPerjalanan} = props;
    let res: ISummary = {summary: [], total: 0};
    let tmp = serviceInfo.filter((item) => item.id.toString() == tambahanService.service.value);
    if (tmp.length > 0) {
        let preSummary = summaryTabel;
        preSummary = preSummary.filter((item: any) => item.jenisPenumpang.value != 'service');
        let qty = preSummary.reduce((acc: any, prev: any) => {
            return acc + prev.qty
        }, 0);
        let harga = tmp[0].harga,
            newService = {
                id: new Date().getTime(),
                keterangan: 'Penjemputan',
                jenisPenumpang: { value: 'service', label: '-' },
                qty: jenisPerjalanan == 'pulang_pergi' ? qty / 2 : qty,
                tarif: harga,
                subtotal: jenisPerjalanan == 'pulang_pergi' ? qty / 2 * harga : qty * harga,
                diskon: '-'
            };
        let sum = [...preSummary, newService];
        let tot = sum.reduce((acc, prev) => {
            return acc + prev.subtotal
        }, 0);
        res = {summary: sum, total: tot}
    }
    return res;
}