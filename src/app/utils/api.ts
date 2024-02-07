
export const BASE_URL = "https://api-sekarjaya.siwalatri.klungkungkab.go.id/api";
export const BASE_URL_SIWALATRI = "https://backend-balisanti.siwalatri.klungkungkab.go.id/api";
export const API_AUTH = {
    LOGIN: `${BASE_URL}/login`    
};

export const API_MASTER_DATA = {
    KAPAL: `${BASE_URL}/master/kapal`,
    JENIS_PENUMPANG: `${BASE_URL}/master/jenis-penumpang`,
    JENIS_KAPAL: `${BASE_URL}/master/jenis-kapal`,
    DERMAGA: `${BASE_URL}/master/dermaga`,
    RUTE: `${BASE_URL}/master/rute`,
    SOP: `${BASE_URL}/master/sop`,
    AGEN: `${BASE_URL}/master/agen`,
    NAHKODA: `${BASE_URL}/master/nahkoda`,
    HARGA_SERVICE: `${BASE_URL}/master/harga-service`,
    KECAKAPAN: `${BASE_URL}/master/kecakapan-nahkoda`,
    JADWAL: `${BASE_URL}/master/jadwal-tiket`,
    USERS: `${BASE_URL}/master/users`,
    PENUMPANG: `${BASE_URL}/master/penumpang`,
    SET_JADWAL_IMAGE: `${BASE_URL}/master/jadwal-tiket/set-image`,
};

export const API_PENJUALAN_TIKET = {
    PENJUALAN: `${BASE_URL}/penjualan`,
    CARI_JADWAL: `${BASE_URL}/penjualan/cari-jadwal`,
    JENIS_PENUMPANG: `${BASE_URL}/penjualan/cari-jenispenumpang-by-jadwal?id_jadwal=`,
    LIST_PENUMPANG_BY_JADWAL: `${BASE_URL}/pembayaran-agen/list-penumpang-jadwal/`,
}

export const API_SIWALATRI = {
    PENUMPANG_GROUP: `${BASE_URL_SIWALATRI}/penumpang-group`,
    JADWAL_KEBERANGKATAN: `${BASE_URL_SIWALATRI}/jadwal_keberangkatan`,
}

export const API_PEMBAYARAN = {
    PEMBAYARAN_AGEN: `${BASE_URL}/pembayaran-agen`,
    LIST_INVOICE: `${BASE_URL}/pembayaran-agen/list-invoice`,
    INVOICE: `${BASE_URL}/pembayaran/search-by-invoice?no_invoice=`,
    BAYAR: `${BASE_URL}/pembayaran`,
    REKAP_TAGIHAN: `${BASE_URL}/pembayaran/recap`,
    SCAN_TIKET: `${BASE_URL}/manifest`,
    LIST_PENUMPANG_DERMAGA: `${BASE_URL}/pembayaran-agen/list-penumpang-dermaga/`,
    LIST_INVOICE_SUGGESTION: `${BASE_URL}/pembayaran/no_invoice-suggestion`,
    DONWLOAD_MULTIPLE_INVOICE: `${BASE_URL}/pembayaran/download-multiple-invoice-pdf`,
    REPORT_BY_RUTE: `${BASE_URL}/pembayaran-agen/list-penumpang-rutes`,
}

export const API_LAPORAN = {
    DETAIL_LAPORAN_OPERATOR: `${BASE_URL}/laporan/operator`,
    REKAP_LAPORAN_OPERATOR: `${BASE_URL}/laporan/operator/recap`,
}

export const API_TIKET_PENUMPANG  = {
    EDIT_TIKET : `${BASE_URL}/tiket-penumpang/edit-tiket`,
    EDIT_INVOICE : `${BASE_URL}/tiket-penumpang/edit-invoice`,
}

export const API_MANIFEST = {
    EDIT_MANIFEST_BULK : `${BASE_URL}/manifest/bulk`,
}

export const API_DASHBOARD = {
    DASHBOARD : `${BASE_URL}/dashboard`,
}

export const API_PRINTER_TIKET = {
    CETAK : "http://localhost/bali-santi-printer",
}