export interface iPenumpangLaporan {
    kode_booking: string;
    no_invoice: string;
    nama_penumpang: string;
    email: string;
    jenis_kelamin: string;
    no_identitas: string;
    tanggal: string;
    waktu_berangkat: string;
    status_manifest: string;
    id_created_by: number;
    created_by: string;
    nama_agen: string;
    service: number;
}

export type IPenumpangLaporanOption = Partial<IPenumpang>
   & { selected: boolean }