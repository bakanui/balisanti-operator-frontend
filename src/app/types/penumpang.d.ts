export interface IJenisPenumpang {
    id: number;
    jenis: string;
    tipe: string;
    status_jenis_penumpang: number;
}

export interface IOpsiPenumpang {
    id: number;
    kategori: 'tipe' | 'jenis';
    nama: string;
}

export interface IPenumpang {
    id: number,
    nama: string,
    no_identitas: string,
    no_telepon: string,
    jenis_kelamin: string,
    email: string
}