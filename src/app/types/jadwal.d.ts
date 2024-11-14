import { IRute } from './rute';

export interface IJadwal {
    id: string;
    id_jadwal: string;
    jenis_jadwal: string;
    id_kapal: number;
    id_nahkoda: number;
    id_rute: number;
    nama_kapal: string;
    nama_nahkoda: string;
    waktu_berangkat: string;
    id_loket: number;
    status_jadwal: number;
    harga_tiket: IHargaTiket[];
    rute: {
        id: number;
        nama_rute: string;
        id_dermaga_awal: number;
        id_dermaga_tujuan: number;
        nama_dermaga_awal: string;
        nama_dermaga_tujuan: string;
    }
    image: string;
}

export interface IHargaTiket {
    id: number;
    id_jadwal: number;
    id_jenis_penumpang: number;
    tiket: number;
    js: number;
    jp: number;
    tipe_penumpang: string;
    jenis_penumpang: string;
}

export interface IPenjualanTiket {
    id: string;
    id_jadwal: string;
    jenis_jadwal: string;
    id_kapal: number;
    id_nahkoda: number;
    id_rute: number;
    waktu_berangkat: string;
    id_loket: number;
    status_jadwal: number;
    nama_nahkoda: string;
    nama_rute: string;
    nama_kapal: string;
    dermaga_awal: string;
    dermaga_tujuan: string;
    sisa_kursi: number;
    kapasitas_penumpang: number;
    id_dermaga_awal: number;
    id_dermaga_tujuan: number;
}

export interface IPenumpangInfo {
    id_jenis_tiket: number;
    id_jenis_penumpang: number;
    jenis_penumpang: string;
    harga_tiket: number;
}

export interface IPenumpang {
    nama_penumpang: string;
    no_identitas: string;
    jenis_kelamin: string;
    email: string;
    tanggal: string;
    jam: string;
    nama_kapal: string;
    dermaga_awal: string;
    dermaga_tujuan: string;
    qrcode: string;
    waktu_berangkat: string;
    kode_booking: string;
    pembayaran: "cash";
    keterangan: 'GO' | 'RT';
}

export interface IPembayaranAgen {
    id: number;
    nama_agen: string;
    tagihan: number;
    sisa_limit: number;
}
export interface IInvoice {
    no_invoice: string;
    tanggal_invoice: string;
    nominal: number;
    flag_lunas: number;
}

export interface IPembayaranHistory {
    ket: string;
    created_at: string;
}

export interface IRekapTagihan {
    total_tagihan: string;
    sudah_dibayarkan: string;
    terhutang: string;
}