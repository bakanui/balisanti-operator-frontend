import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
    onClick?: () => void;
}
export const SeeMore = (props: IProps) =>{
    return(
        <div className='flex justify-end' onClick={props.onClick}>
            <div className='flex items-center cursor-pointer'>
            <div className='font-robotoregular text-sm mr-4'>
                Lihat Semua
            </div>
            <FontAwesomeIcon className='text-primary' icon={faArrowRight}/>
            </div>
        </div>
    );
}