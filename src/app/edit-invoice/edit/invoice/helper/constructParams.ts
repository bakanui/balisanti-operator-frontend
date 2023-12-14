import { IOptions } from "@/app/types/auth";
import { parseDateToBackendFormat } from "@/app/utils/utility";

interface IConstructParams {
    invoice: string;
    selectedAgen: IOptions;
    tambahanService: any;
    jenisPerjalanan: 'sekali_jalan' | 'pulang_pergi';
    tanggalKeberangkatan: Date;
    tanggalKembali: Date;
    penumpang: any[];
    id_jadwal: number | string;
    id_jadwal_pulang: number | string;
}
export const constructParams = (props: IConstructParams) => {
    const {
        invoice,
        selectedAgen,
        tambahanService,
        jenisPerjalanan,
        tanggalKeberangkatan,
        tanggalKembali,
        id_jadwal,
        penumpang,
        id_jadwal_pulang
    } = props;
    const params = {
        no_invoice: invoice,
        id_agen: selectedAgen.value,
        id_service: tambahanService.service.value || undefined,
        set_pp: jenisPerjalanan == 'pulang_pergi' ? 1 : 0,
        tanggal_berangkat: parseDateToBackendFormat(tanggalKeberangkatan),
        tanggal_pulang: parseDateToBackendFormat(tanggalKembali),
        id_jadwal,
        penumpang: penumpang,
        id_jadwal_pulang: id_jadwal_pulang || undefined,
        nama_perantara: undefined
    }
    return params;
}