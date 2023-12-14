interface IDetailJadwal {
    id: string
    waktu_berangkat: string
    nama_nahkoda: string
    nama_rute: string
    nama_kapal: string
    id_dermaga_awal: number
    dermaga_awal: string
    id_dermaga_tujuan: number
    dermaga_tujuan: string
    sisa_kursi: number
    kapasitas_penumpang: number
}
export const mapDetailToTiket = (detailJadwal: IDetailJadwal) => {
    return{
        waktu_berangkat: detailJadwal.waktu_berangkat,
        id: '1',
        jenis_jadwal: '',
        id_jadwal: '',
        id_kapal: 0,
        id_nahkoda: 0,
        id_rute: 0,
        id_loket: 0,
        status_jadwal: 0,
        nama_nahkoda: detailJadwal.nama_nahkoda,
        nama_rute: detailJadwal.nama_rute,
        nama_kapal: detailJadwal.nama_kapal,
        dermaga_awal: detailJadwal.dermaga_awal,
        dermaga_tujuan: detailJadwal.dermaga_tujuan,
        sisa_kursi: detailJadwal.sisa_kursi,
        kapasitas_penumpang: detailJadwal.kapasitas_penumpang,
        id_dermaga_awal: detailJadwal.id_dermaga_awal,
        id_dermaga_tujuan: detailJadwal.id_dermaga_tujuan,
    }
}