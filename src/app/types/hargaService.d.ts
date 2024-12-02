export interface IHargaService {
    id: number;
    kode_barang: string;
    qrcode: string;
    id_jenis_penumpang: number;
    nama_barang: string;
    id_dermaga_tujuan: number;
    harga: number;
    qty: number;
    status_service: number;
    tipe_penumpang: string;
    jenis_penumpang: string;
    jenis_barang: string;
    dermaga_awal: string;
    dermaga_tujuan: string;
    tanggal: string;
    nama_penumpang:string;
}