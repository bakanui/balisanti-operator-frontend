import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SecondarySelectBox } from "./SecondarySelectBox";
import { faSearch } from '@fortawesome/free-solid-svg-icons'

interface IProps {
    onChange?:(e: any) => void
    limitChange?: (data: any)=> void;
}
export const TableFilter = (props: IProps) => {
    return(
        <div className="flex justify-between">
            <div className="flex items-center">
                <span className="text-xs font-robotoregular mr-2">Menampilkan </span>
                <div>
                    <SecondarySelectBox 
                        placeholder=""
                        option={[
                            {value: '10', label: '10'},
                            {value: '25', label: '25'},
                            {value: '50', label: '50'},
                            {value: '100', label: '100'},
                        ]}
                        onChange={props.limitChange}
                    />
                </div>
            </div>
            <div>
                <div className="w-[200px] relative">
                    <input 
                    onChange={props.onChange}
                    className="h-[40px] w-full text-xs rounded-lg font-robotoregular border-solid border-2 border-[#B7BFDD] pl-2 pr-8" 
                    placeholder={'cari di sini...'}/>
                    <div className="absolute top-2 right-2">
                        <FontAwesomeIcon className="text-slate-400" icon={faSearch}/>
                    </div>
                </div>
            </div>
        </div>
    );
}