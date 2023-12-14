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
    onChange?: (date: Date) => void;
    value?: Date;
    minDate?: Date;
}
export const DatePicker = (props: IProps) => {
    const [show, setShow] = useState(false);
    const [date, setDate] = useState('-');

    useEffect(()=> {
        if (props.value) {
            let d = props.value || new Date();
            setDate(parseDateIncludeHours(d, true));
        }
    },[props.value]);

    const onSelect = (date: Date) => {
        props.onChange && props.onChange(date);
        setShow(!show);
    }

    return(
        <div className="sm:flex sm:flex-col w-full relative">
            {props.label && <div className="font-robotomedium mb-2 text-sm">{props.label}</div>}
            <div className='text-input text-sm font-robotoregular mb-4 cursor-pointer flex items-center justify-between' onClick={()=>setShow(!show)}>
                <span className='text-sm font-robotoregular'>{date}</span>
                <FontAwesomeIcon className='text-slate-400' icon={faCalendar}/>
            </div>
            {show ? 
                <div className='absolute z-[100] top-[80px] border-primary bg-white border-2 rounded-md'>
                    <div onClick={()=>setShow(!show)} className='h-[24px] w-[24px] rounded-full flex justify-center items-center bg-primary absolute right-2 top-2 cursor-pointer'>
                        <FontAwesomeIcon className='text-white' icon={faClose}/>
                    </div>
                    <Calendar
                        date={props.value}
                        onChange={onSelect}
                        minDate={props.minDate}
                    />
                </div>
            : null}
        </div>
    );
}