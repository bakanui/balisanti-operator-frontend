import { IOptions } from "../types/auth";

export const JENIS_PEMBAYARAN: IOptions[] = [
    {value: 'tunai', label: 'Tunai'},
    {value: 'debit', label: 'Kartu Debit'},
    {value: 'kredit', label: 'Kartu Credit'},
    {value: 'qris', label: 'QRIS'},
    {value: 'va', label: 'Virtual Account BPD'},
];