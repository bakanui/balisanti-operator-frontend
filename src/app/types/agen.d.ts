export interface IAgen {
    id: number;
    nama_agen: string;
    no_telp: string;
    email: string;
    batas_limit: number;
    jenis_diskon: 'nominal' | 'persen';
    nominal_diskon: number;
    status_agen: number;
    sisa_limit?: number;
}
