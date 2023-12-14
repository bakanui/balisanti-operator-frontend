import { IAgen } from "@/app/types/agen";
import { IHargaService } from "@/app/types/hargaService";
import { IPenumpangInfo } from "@/app/types/jadwal";
import { convertLabelToPrice } from "@/app/utils/utility";

interface ICalculateServiceProps {
    penumpangInfo: IPenumpangInfo[];
    rombongan: any[];
    jenisPerjalanan: 'sekali_jalan' | 'pulang_pergi';
    agenHolder: IAgen | null;
    summaryTabel: any[];
    serviceInfo: IHargaService[];
    tambahanService: any;
}
export const calculateTotal = (props: ICalculateServiceProps) => {
    const {
        penumpangInfo, 
        rombongan, 
        jenisPerjalanan, 
        agenHolder, 
        summaryTabel,
        serviceInfo,
        tambahanService
    } = props;
    const jenisIdOnly = penumpangInfo.map((item) => item.id_jenis_penumpang);
    let summary = [];
    for (let i = 0; i < jenisIdOnly.length; i++) {
        let id = jenisIdOnly[i].toString();
        let tmp = rombongan.filter((item: any) => item.jenisPenumpang.value == id);
        if (tmp.length <= 0) {
            // do nothing
        }
        else {
            let diskon = 0, subtotal = 0;
            if (jenisPerjalanan == 'pulang_pergi') {
                subtotal = (tmp.length * 2) * penumpangInfo[i].harga_tiket; //kali 2 karena PP (pulang pergi)
                if (agenHolder && agenHolder.jenis_diskon == 'persen') {
                    diskon = (agenHolder.nominal_diskon / 100) * subtotal;
                    subtotal = subtotal - diskon;
                }
                if (agenHolder && agenHolder.jenis_diskon == 'nominal') {
                    diskon = agenHolder.nominal_diskon * (tmp.length * 2); //kali 2karena PP (pulang pergi)
                    subtotal = subtotal - diskon;
                }
                summary.push({
                    id: new Date().getTime(),
                    keterangan: 'Tiket',
                    jenisPenumpang: tmp[0].jenisPenumpang,
                    qty: tmp.length * 2,
                    tarif: penumpangInfo[i].harga_tiket,
                    subtotal: subtotal,
                    diskon: agenHolder && agenHolder.jenis_diskon == 'persen' ? agenHolder.nominal_diskon + '%' : 'Rp. ' + convertLabelToPrice(agenHolder ? `${agenHolder.nominal_diskon}` : '0')
                });
            } else {
                subtotal = tmp.length * penumpangInfo[i].harga_tiket;
                if (agenHolder && agenHolder.jenis_diskon == 'persen') {
                    diskon = (agenHolder.nominal_diskon / 100) * subtotal;
                    subtotal = subtotal - diskon;
                }
                if (agenHolder && agenHolder.jenis_diskon == 'nominal') {
                    diskon = agenHolder.nominal_diskon * tmp.length;
                    subtotal = subtotal - diskon;
                }
                summary.push({
                    id: new Date().getTime(),
                    keterangan: 'Tiket',
                    jenisPenumpang: tmp[0].jenisPenumpang,
                    qty: tmp.length,
                    tarif: penumpangInfo[i].harga_tiket,
                    subtotal: subtotal,
                    diskon: agenHolder && agenHolder.jenis_diskon == 'persen' ? agenHolder.nominal_diskon + '%' : 'Rp. ' + convertLabelToPrice(agenHolder ? `${agenHolder.nominal_diskon}` : '0')
                });
            }
        }
    }
    const service = summaryTabel.filter((item) => item.jenisPenumpang.value == 'service');
    if (service.length > 0) {
        let qty = summary.reduce((acc, curr) => {
            return acc + curr.qty
        }, 0);
        let tmp = serviceInfo.filter((item) => item.id.toString() == tambahanService.service.value);
        let harga = tmp[0].harga;
        if (jenisPerjalanan == 'pulang_pergi') {
            qty = qty / 2;
        }
        summary.push({
            ...service[0],
            qty: qty,
            tarif: harga,
            subtotal: qty * harga
        });
    }
    let total = summary.reduce((prev, next) => {
        return prev + next.subtotal;
    }, 0);
    return {
        summary,
        total
    }
}