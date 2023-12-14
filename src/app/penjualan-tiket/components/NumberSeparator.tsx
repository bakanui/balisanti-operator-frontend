
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { ProSidebarProvider } from "react-pro-sidebar";

interface IProps {
    value: number;
    onClick: () => void;
    enable: boolean;
}
export const NumberSeparator = (props: IProps) => {
    return(
        <div className="my-4 relative">
            <hr/>
            <div onClick={props.enable ? props.onClick : undefined} className={`font-robotomedium text-sm w-[44px] h-[44px] ${props.enable ? 'cursor-pointer' : undefined} rounded-full bg-[#B7BFDD] flex items-center justify-center absolute right-0 top-[-22px]`}>
                <span>{props.value}</span>
                {props.enable && (
                    <div className="absolute right-[-10px] top-[-10px] w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center drop-shadow-xl">
                        <FontAwesomeIcon className="text-sm" icon={faClose}/>
                    </div>
                )}
            </div>
        </div>
    );
}