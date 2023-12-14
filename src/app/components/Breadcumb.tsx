'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {usePathname} from 'next/navigation';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

interface IProps {
    title: string;
    onBack?: ()=>void;
    route?: string;
    noRoute?: boolean;
}

export const CustomBreadcumb = (props: IProps) => {
    const router = usePathname();

    const _path = () => {
        let r = router?.split('/');
        if(!r) return;
        r.shift();
        r?.pop();
        return r.join(' / ');
    }

    const _pathEnd = () => {
        let r = router?.split('/');
        if(!r) return;
        return r[r.length - 1];
    }

    return(
        <div className="w-full h-[64px] flex flex-row items-center justify-between">
            <div onClick={props.onBack} className={`flex flex-row ${props.onBack ? 'cursor-pointer' : undefined} justify-center items-center`}>
                {props.onBack ? 
                    <div className='mr-3'>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </div>
                : null} 
                <span className="text-base font-robotomedium">{props.title}</span>
            </div>
            {props.noRoute ? null : <span className="text-xs font-robotoregular text-primary" >{_path()} <span className='text-[black] dark:text-white'>/ {_pathEnd()}</span></span>}
        </div>
    );
}