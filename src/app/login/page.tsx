'use client';
import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { InputPassword } from "../components/InputPassword";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { setStorageValue } from "../utils/localstoreage";
import { loginAction } from "./service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [tmp, setTmp] = useState<any>([]);
    
    const login = () => {
        if (!username || !password) {
            toast.error('Pastikan Username atau Password telah terisi!', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return;
        }
        setLoading(true);
        loginAction(
            username,
            password,
            (data)=>{
                setStorageValue('auth', data);
                router.replace('/');
            },
            (err)=>{
                setLoading(false);
                toast.error(err, {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        );
    }

    const generate = () => {
        let data0 = [
            'i_prasaranafaskes_kategori',
            'i_prasaranakebersihan',
            'i_prasaranakebersihan_kategori',
            'i_produkunggulan',
            'i_produkunggulan_kategori',
            'i_saranakebersihan',
            'i_saranaproduksiperikanan',
            'i_saranaproduksiperikanan_kategori',
            'i_saranaproduksipertanian',
            'i_saranaproduksipertanian_kategori',
            'i_statuskepemilikan',
            'i_sulinggih',
            'i_sulinggih_kategori',
            'i_tenagamedis',
            'i_tenagamedis_kategori',
            'instrument_validator',
            'item_validator',
            'jenis_budaya_sakral',
            'jenis_padruwen',
            'jenis_palemahan',
            'jenis_parayangan',
            'jenis_pura',
            'jenis_usaha_desa_adat',
            'kategori_akomodasi',
            'kategori_budaya_sakral',
            'kategori_daya_tarik_wisata',
            'kategori_padruwen',
            'kategori_palemahan',
            'kategori_parayangan',
            'kategori_seni_budaya'
        ];
        let data1 = [
            'kategori_usaha_desa_adat',
            'krama_pura',
            'lembaga_seni_budaya',
            'mapping_validator',
            'master_instrumen',
            'migrations',
            'padruwen_desa_adat',
            'palemahan',
            'parahyangan',
            'password_resets',
            'periode',
            'periode_validator',
            'permission_role',
            'permissions',
            'permissions_old',
            'public_home',
            'public_info',
            'public_news',
            'public_subscribe',
            'pura',
            'report_instrument_validator',
            'source_instrumen',
            'status_validator',
            'tb_desaadat',
            'tb_desaadat_old',
            'tb_desaadat_ori',
            'tb_desadat_register',
            'tb_krama',
            'tb_nodata',
            'tb_penduduk',
            'tb_progress',
            'unit_usaha_desa_adat',
            'usaha_desa_adat',
            'usaha_desa_adat_krama',
            'users'
        ];
        let data2 = [
            'akomodasi',
            'audits',
            'budaya_sakral_komunal',
            'confirmation_validator',
            'dashboard',
            'daya_tarik_wisata',
            'failed_jobs',
            'i_banjaradat',
            'i_datakrama',
            'i_datakrama_kategori',
            'i_detailkrama',
            'i_industrikreatif',
            'i_industrikreatif_kategori',
            'i_kasuskriminalitas',
            'i_lembagalainnya',
            'i_lembagalainnya_kategori',
            'i_lembagapendidikan',
            'i_lembagapendidikan_kategori',
            'i_matapencaharian',
            'i_pekerjaan',
            'i_pekerjaan_kategori',
            'i_pendataankeamanan',
            'i_pendataankeamanan_kategori',
            'i_pendidikanterakhir',
            'i_perikanan',
            'i_perikanan_kategori',
            'i_pertanian',
            'i_pertanian_jenis',
            'i_pertanian_jenislahan',
            'i_prasaranafaskes'
        ];
        let data3 = [
            'a_aturan_lain',
            'a_awig',
            'a_banjardinas_desadat',
            'a_bidang_perarem',
            'a_kategori',
            'a_kategori_wilayah_adat', 
            'a_kerta_desa',
            'a_paiketan',
            'a_paiketan_detail_anggota',
            'a_pecalang',
            'a_perarem',
            'a_pesraman',
            'a_sabha_desa',
            'a_sekaa',
            'a_staf_administrasi',
            'a_tb_anggota_lembaga',
            'a_tb_bradat',
            'a_tb_desaadat',
            'a_tb_fasilitas_bradat',
            'a_tb_kabkot',
            'a_tb_kecamatan',
            'a_tb_krama',
            'a_tb_master_jabatan',
            'a_tb_master_jenis_desaadat',
            'a_tb_master_jenis_seka',
            'a_tb_paiketan_detail_prajuru',
            'a_tb_periode_prajuru_banjar',
            'a_t_periode_prajuru_desa',
            'a_t_periode_prajuru_lembaga',
            'a_t_periode_prajuru_paiketan',
            'a_tb_prajuru_banjar_detail',
            'a_tb_prajuru_desa_detail',
            'a_tb_prajuru_lembaga_detail',
            'a_wicara',
            'a_yowana'
        ];
        let data = [...data0, ...data1, ...data2, ...data3];
        let tmpData = [];
        for(let i = 0; i < data.length; i++) {
            // let ff = `Schema::table('${data[i]}', function (Blueprint $table) {${'\n'} $table->integer('periode_id')->nullable();${'\n'}});`;
            // console.log(`Schema::table('${data[i]}', function (Blueprint $table) {${'\n'} $table->integer('periode_id')->nullable();${'\n'}});`);
            let query = `UPDATE ${data[i]} set periode_id = 2;`;
            console.log(query);
            tmpData.push(query);
        }
        setTmp(tmpData);
    }

    return(
        <div className="flex bg-white h-screen">
            <div className="flex flex-col w-full bg-[white] px-[5%] pt-8">
                <div>
                    <div className='w-full h-[60px] bg-[url(./../assets/logo-primary.png)] bg-contain bg-no-repeat bg-left'></div>
                </div>
                <div className="h-full flex flex-col">
                    <div className="font-robotomedium text-3xl mt-20 mb-10">Log in to Your account</div>
                    <Input 
                        label="Email or mobile"
                        placeholder="Your email or mobile number"
                        onChangeText={(e)=>setUsername(e.target.value)}
                    />
                    <div className="mb-4"/>
                    <InputPassword
                        label="Password"
                        placeholder="Your password"
                        onChangeText={(e)=>setPassword(e.target.value)}
                        value={password}
                    />
                    <div className="mb-12"/>
                    <Button 
                        label="Log in"
                        onClick={login}
                    />
                </div>
            </div>
            <div className="hidden sm:block sm:bg-[url(../assets/ocean-view.png)] w-full bg-cover"></div>
            <LoadingOverlay 
                loading={loading}
                title="Mohon tunggu..."
            />
            <ToastContainer/>
        </div>
    );
}
export default Login;