import { IOptions } from "../types/auth";

export const JENIS_PENUMPANG: IOptions[] = [
    {value: 'Lokal', label: 'Lokal'},
    {value: 'Domestik', label: 'Domestik'},
    {value: 'Mancanegara', label: 'Mancanegara'},
    {value: 'Lokal (PP)', label: 'Lokal (PP)'},
    {value: 'Domestik (PP)', label: 'Domestik (PP)'},
    {value: 'Mancanegara (PP)', label: 'Mancanegara (PP)'},
    {value: 'Golongan I', label: 'Golongan I'},
    {value: 'Golongan II', label: 'Golongan II'},
    {value: 'Golongan III', label: 'Golongan III'},
    {value: 'Golongan IV', label: 'Golongan IV'},
    {value: 'Golongan V', label: 'Golongan V'},
    {value: 'Golongan VI', label: 'Golongan VI'},
    {value: 'Golongan VII', label: 'Golongan VII'},
];

export const JENIS_PENUMPANG_FILTER: IOptions[] = [
    {value: 'Semua', label: 'Semua Jenis Penumpang'},
    {value: 'Lokal', label: 'Lokal'},
    {value: 'Domestik', label: 'Domestik'},
    {value: 'Mancanegara', label: 'Mancanegara'}
];