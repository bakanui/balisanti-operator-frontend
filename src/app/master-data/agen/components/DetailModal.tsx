import { Button } from "@/app/components/Button";
import { IAgen } from "@/app/types/agen";
import { convertLabelToPrice } from "@/app/utils/utility";
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
    item: IAgen | null;
    closeModal: ()=>void;
}
export const DetailModal  = (props: IProps) => {
    return(
            <div className="w-[30vw]">
                <div onClick={props.closeModal} className='h-[24px] w-[24px] rounded-full flex justify-center items-center bg-primary absolute right-2 top-2 cursor-pointer'>
                    <FontAwesomeIcon className='text-white' icon={faClose}/>
                </div>
                <div className="font-robotomedium mb-3 text-lg">Detail Agen</div>
                <div className="flex font-robotoregular text-sm mb-3">
                    <div className="w-[220px]">Nama</div>
                    <div className="font-robotomedium">: {props.item ? props.item.nama_agen : '-'}</div>
                </div>
                <div className="flex font-robotoregular text-sm mb-3">
                    <div className="w-[220px]">Nomor Telepon</div>
                    <div className="font-robotomedium">: {props.item ? props.item.no_telp : '-'}</div>
                </div>
                <div className="flex font-robotoregular text-sm mb-3">
                    <div className="w-[220px]">Email</div>
                    <div className="font-robotomedium">: {props.item ? props.item.email : '-'}</div>
                </div>
                <div className="flex font-robotoregular text-sm mb-3">
                    <div className="w-[220px]">Jenis Pengurangan Harga</div>
                    <div className="font-robotomedium">: {props.item ? props.item.jenis_diskon : '-'}</div>
                </div>
                {props.item && props.item.jenis_diskon == 'nominal' ? 
                    <div className="flex font-robotoregular text-sm mb-3">
                    <div className="w-[220px]">Maksimal Hutang</div>
                    <div className="font-robotomedium">: Rp {props.item ? convertLabelToPrice(`${props.item.batas_limit}`) : '-'}</div>
                </div>
                : 
                <div className="flex font-robotoregular text-sm mb-3">
                    <div className="w-[220px]">Nominal Diskon</div>
                    <div className="font-robotomedium">: {props.item ? props.item.nominal_diskon : '-'}%</div>
                </div>
                }
                <div className="w-full mt-6">
                    <Button 
                        label="Tutup"
                        onClick={props.closeModal}
                    />
                </div>
            </div>
    );
}