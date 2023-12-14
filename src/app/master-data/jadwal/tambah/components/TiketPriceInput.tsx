import { SelectBox } from "@/app/components/SelectBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { PriceInput } from "@/app/components/PriceInput";
import { IJenisPenumpang } from "@/app/types/penumpang";
import { IOptions } from "@/app/types/auth";

interface IProps {
    onDelete: () =>void;
    deleteAble: boolean;
    value: any;
    options: IOptions[];
    onOptionChange: (data: any)=> void;
    priceValue: string;
    priceChange: (text: string)=> void;
}
export const TiketPriceInput = (props: IProps) => {
    return(
        <div className="sm:grid gap-x-6 grid-cols-2">
            <SelectBox
                label="Jenis Penumpang"
                placeholder="Pilih data"
                option={props.options}
                value={props.value}
                onChange={props.onOptionChange}
            />
            <div className="flex items-center justify-center">
                <PriceInput
                    label="Harga Tiket"
                    placeholder="100.000"
                    onChangeText={props.priceChange}
                    value={props.priceValue}
                />
                {props.deleteAble ? 
                    <div onClick={props.onDelete} className="w-[30px] h-[48px] flex items-center justify-center mt-2 cursor-pointer">
                        <FontAwesomeIcon className="text-primary" icon={faTrashCan}/>
                    </div>
                : null}
            </div>
        </div>
    );
}