'use client'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Calendar } from 'react-date-range';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { parseDateIncludeHours } from '../utils/utility';

interface IProps {
    label: string;
}
export const SecondaryDatePicker = (props: IProps) => {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState('-');

    useEffect(()=> {
        let d = new Date();
        setDate(parseDateIncludeHours(d, true));
    },[]);

    return(
        <div className="sm:flex sm:flex-col w-full relative">
            {props.label && <div className="font-robotoregular mb-2 text-xs">{props.label}</div>}
            <div className='h-[32px] w-full text-xs rounded-lg font-robotoregular border-solid border-2 border-[#B7BFDD] cursor-pointer flex items-center justify-between pl-2 pr-2' onClick={()=>setShow(!show)}>
                <span className='text-sm font-robotoregular'>{date}</span>
                <FontAwesomeIcon className='text-slate-400' icon={faCalendar}/>
            </div>
            {show ? 
                <div className='absolute z-[100] top-[80px] border-primary bg-white border-2 rounded-md'>
                    <div onClick={()=>setShow(!show)} className='h-[24px] w-[24px] rounded-full flex justify-center items-center bg-primary absolute right-2 top-2 cursor-pointer'>
                        <FontAwesomeIcon className='text-white' icon={faClose}/>
                    </div>
                    <Calendar
                        date={new Date()}
                        onChange={()=>{}}
                    />
                </div>
            : null}
        </div>
    );
}