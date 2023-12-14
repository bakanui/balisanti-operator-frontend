
export interface IKapal {
    id: string;
    nama_kapal: string;
    mesin: string;
    panjang: number;
    lebar: number;
    kilometer: number;
    kedalaman: number;
    grt: string;
    dwt: string;
    callsign: string;
    status_kapal: number;
    id_jenis_kapal: number;
    id_armada: string;
    nama_jenis_kapal: string;
    kapasitas_awak: number;
    kapasitas_penumpang: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: any;
}

export interface IJenisKapal {
    id: number;
    nama_jenis_kapal: string;
}