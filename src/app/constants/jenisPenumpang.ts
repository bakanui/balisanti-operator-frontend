import { IOptions } from "../types/auth";

export const JENIS_PENUMPANG: IOptions[] = [
    {value: 'Lokal', label: 'Lokal'},
    {value: 'Domestik', label: 'Domestik'},
    {value: 'Mancanegara', label: 'Mancanegara'},
    {value: 'Lokal (PP)', label: 'Lokal (PP)'},
    {value: 'Domestik (PP)', label: 'Domestik (PP)'},
    {value: 'Mancanegara (PP)', label: 'Mancanegara (PP)'},
    {value: 'Kendaraan', label: 'Kendaraan'},
];

export const JENIS_PENUMPANG_FILTER: IOptions[] = [
    {value: 'Semua', label: 'Semua Jenis Penumpang'},
    {value: 'Lokal', label: 'Lokal'},
    {value: 'Domestik', label: 'Domestik'},
    {value: 'Mancanegara', label: 'Mancanegara'}
];