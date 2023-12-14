interface IDetailPenumpang {
    id_jadwal: number
    kode_booking: string
    nama_penumpang: string
    no_identitas: string
    jenis_kelamin: string
    email: string
    tanggal: string
    jam: string
    nama_kapal: string
    dermaga_awal: string
    dermaga_tujuan: string
    id_jenis_penumpang: number
    id_jadwal_jenispenumpang: number
    qrcode: string
    keterangan: string
    waktu_berangkat: string;
    jenis_penumpang: string;
}
export const constructPassangers = (penumpang: any[]) => {
    const tmp = penumpang.filter((item: IDetailPenumpang)=> item.keterangan == 'GO'),
    tmpKeberangkatan = tmp.map((item: IDetailPenumpang)=> {
        return {
            id: item.id_jadwal,
            jenisPenumpang: { value: item.id_jenis_penumpang, label: item.jenis_penumpang},
            nama: item.nama_penumpang,
            noIdentitas: item.no_identitas,
            jenisKelamin: { value: item.jenis_kelamin, label: item.jenis_kelamin == 'l' ? 'Laki-laki' : 'Perempuan' },
            email: item.email
        }
    })
    return tmpKeberangkatan;
}

export const constructService = (detail: any) => {
    let acc = {
        isTambahanService: false,
        service: { value: '', label: 'Pilih Data' }
    };
    if (detail.service) {
        acc = {
            isTambahanService: true,
            service: { value: detail.service.id, label: detail.service.area_jemput }
        };
    }
    return acc;
}