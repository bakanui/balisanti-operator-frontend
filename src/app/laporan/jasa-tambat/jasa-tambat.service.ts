import axios from 'axios';
import { API_SIWALATRI, BASE_ARMADA } from '@/app/utils/api';

export class JasaTambatService {
  static async fetchJasaTambat() {
    const response = await axios.get(API_SIWALATRI.JASA_TAMBAT);
    let items = response.data?.data || response.data || [];
    if (Array.isArray(items)) {
      return items.filter((item: any) => 
        item.id_armada === BASE_ARMADA && 
        item.verif1_by !== null && 
        item.verif2_by !== null
      );
    }
    return [];
  }

  static async downloadJasaTambat(item: any) {
    const response = await axios.get(`${API_SIWALATRI.JASA_TAMBAT}/${item.id}/download`, {
      responseType: 'blob'
    });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Jasa_Tambat_${(item.nama_armada || item.armada?.nama_armada || 'Armada').replace(/\s+/g, '_')}_${item.tanggal}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

}
