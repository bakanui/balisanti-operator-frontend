export interface IDermaga {
    id: number;
    nama_dermaga: string;
    lokasi_dermaga: string;
    status_dermaga: number;
    created_at: string;
    updated_at: string;
}

export interface IDetailLaporanDermaga {
    nama_dermaga: string;
    nama_operator: string;
    jenis_transaksi: string;
    metode_bayar: string;
    nominal: number;
    waktu_bayar: string;
}

export interface IRekapDetailLaporan {
    tunai: number;
    non_tunai: number;
}