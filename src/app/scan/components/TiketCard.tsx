import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { ShipIcon } from "@/assets/svg/ShipIcon";
import { PassangerIcon } from "@/assets/svg/PassangerIcon";
import { IPenjualanTiket } from "@/app/types/jadwal";
interface IProps {
    jadwal: IPenjualanTiket;
    title?: string;
    onClick?: () => void;
    shadow?: boolean;
}
export const TiketCard = (props: IProps) => {
    return(
        <div onClick={props.onClick} className={`w-full bg-white dark:bg-slate-700 ${props.shadow ? 'shadow-md': undefined} rounded-xl hover:scale-[1.05] transform-gpu cursor-pointer duration-200`}>
            <div className="bg-primary h-[50px] w-full text-sm text-white font-robotomedium flex items-center justify-center rounded-t-xl">
                {props.title ||  props.jadwal.waktu_berangkat}
            </div>
            <div className="p-4">
                <div className="flex flex-row">
                    <div className="flex flex-col w-full pr-2">
                        <span className="text-xs font-robotoregular">Dari</span>
                        <div className="text-sm font-robotomedium">{props.jadwal.dermaga_awal}</div>
                    </div>
                    <div className="w-[35px]">
                        <div className="h-[30px] w-[30px] rounded-full flex items-center justify-center bg-primary text-white">
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </div>
                    </div>
                    <div className="flex flex-col w-full pl-2">
                        <span className="text-xs font-robotoregular">Ke</span>
                        <div className="text-sm font-robotomedium">{props.jadwal.dermaga_tujuan}</div>
                    </div>
                </div>
                <hr className="my-4"/>
                <div className="flex">
                    <div className="h-[30px] w-[30px] bg-primary flex justify-center items-center rounded-full">
                        <FontAwesomeIcon className="text-[white] text-sm" icon={faUser}/>
                    </div>
                    <div className="ml-3">
                        <div className="text-xs font-robotoregular">Nahkoda</div>
                        <div className="text-sm font-robotomedium">{props.jadwal.nama_nahkoda}</div>
                    </div>
                </div>
                <div className="flex mt-4">
                    <div className="h-[30px] w-[30px] flex justify-center items-center rounded-full">
                        <ShipIcon/>
                    </div>
                    <div className="ml-3">
                        <div className="text-xs font-robotoregular">Kapal</div>
                        <div className="text-sm font-robotomedium">{props.jadwal.nama_kapal}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}