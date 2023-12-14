'use client'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker, Range } from 'react-date-range';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { parseDateIncludeHours } from '../utils/utility';
import { Button } from './Button';

interface IProps {
    label: string;
    date: Range;
    onChange: (ranges: Range) => void;
    onFilter: ()=> void;
    filterText?: string;
}
export const RangeDatePicker = (props: IProps) => {
    const [show, setShow] = useState(false);

    const onChange = (ranges: any) => {
        props.onChange(ranges.selection);
    }

    const filter = () => {
        setShow(false);
        props.onFilter();
    }

    return(
        <div className="sm:flex sm:flex-col w-full relative">
            {props.label && <div className="font-robotoregular mb-2 text-xs">{props.label}</div>}
            <div className='h-[32px] w-full text-xs rounded-lg font-robotoregular border-solid border-2 border-[#B7BFDD] cursor-pointer flex items-center justify-between pl-2 pr-2' onClick={()=>setShow(!show)}>
                <span className='text-sm font-robotoregular'>{parseDateIncludeHours(props.date.startDate || new Date(), true)} - {parseDateIncludeHours(props.date.endDate || new Date(), true)} </span>
                <FontAwesomeIcon className='text-slate-400' icon={faCalendar}/>
            </div>
            {show ? 
                <div className='absolute z-[100] top-[80px] border-primary bg-white border-2 rounded-md pt-10'>
                    <div onClick={()=>setShow(!show)} className='h-[24px] w-[24px] rounded-full flex justify-center items-center bg-primary absolute right-2 top-2 cursor-pointer'>
                        <FontAwesomeIcon className='text-white' icon={faClose}/>
                    </div>
                    <DateRangePicker
                        ranges={[props.date]}
                        onChange={onChange}
                        rangeColors={['#008AA1']}
                    />
                    <div className='flex justify-end p-2 border-t-[1px]'>
                        <div className='w-[120px] mr-2'>
                            <Button 
                                label='Tutup'
                                outline
                                onClick={()=>setShow(false)}
                            />
                        </div>
                        <div className='w-[120px]'>
                            <Button 
                                label={props.filterText || 'Filter'}
                                onClick={filter}
                            />
                        </div>
                    </div>
                </div>
            : null}
        </div>
    );
}