import { Button } from './Button';
import { CustomModal } from './CustomModal';
import { IPenumpangOption } from "@/app/pembayaran-agen/components/PenumpangListKeberangkatan";

interface IProps {
    penumpang: IPenumpangOption[];
    isOpen: boolean;
    closeAlert: () => void;
}
export const AlertChecker = ({
    isOpen,
    closeAlert,
    penumpang
}: IProps) => {
    return(
        <CustomModal 
            modalIsOpen={isOpen}
            closeModal={closeAlert}
        >
            <div className="sm:w-[25vw]">
                <span className="font-robotomedium text-lg dark:text-black">Mohon Maaf, Waktu Check-In Belum Tiba</span>
                <div className="font-robotoregular text-sm mt-2: dark:text-black">
                {/* <p>Mohon Maaf, Waktu Check-In Belum Tiba</p><br />     */}
                <br /><table>
                    {/* <tr>
                        <td>Agent Name</td>
                        <td>&nbsp;: {penumpang[0].</td>
                    </tr> */}
                    <tr>
                        <td>Passenger Name</td>
                        <td>&nbsp;: {penumpang[0]?.nama_penumpang || ''}</td>
                    </tr>
                    <tr>
                        <td>Dari</td>
                        <td>&nbsp;: {penumpang[0]?.dermaga_awal || ''}</td>
                    </tr>
                    <tr>
                        <td>Ke</td>
                        <td>&nbsp;: {penumpang[0]?.dermaga_tujuan || ''}</td>
                    </tr>
                    <tr>
                        <td>Tanggal</td>
                        <td>&nbsp;: {penumpang[0]?.tanggal || ''}</td>
                    </tr>
                    <tr>
                        <td>Jam Keberangkatan</td>
                        <td>&nbsp;: {penumpang[0]?.waktu_berangkat || ''}</td>
                    </tr>
                </table><br />
                <p>Waktu check-in baru dapat dilakukan 30 menit sebelum keberangkatan.</p><br />
                <p>Jika ingin melakukan reschedule, silakan menuju operator untuk bantuan lebih lanjut.</p>
                </div>
                <div className="flex justify-end mt-6">
                    <div className="flex w-[80%]">
                        <Button 
                            label='Tutup'
                            outline
                            onClick={closeAlert}
                        />
                    </div>
                </div>
            </div>
        </CustomModal>
    );
}