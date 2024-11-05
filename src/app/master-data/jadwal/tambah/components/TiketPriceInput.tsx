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
    jsValue: string;
    jsChange: (text: string)=> void;
    jpValue: string;
    jpChange: (text: string)=> void;
}
export const TiketPriceInput = (props: IProps) => {
    console.log(props.jpValue)
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
                    placeholder="0"
                    onChangeText={(e) => console.log(e)}
                    value={String(Number(props.priceValue?.replace('.', '')) + Number(props.jpValue?.replace('.', '')) + Number(props.jsValue?.replace('.', '')))}
                    disabled={true}
                />
                <div className="flex items-center justify-center" style={{marginLeft: 10}}>
                    <PriceInput
                        label="Tiket"
                        placeholder="0"
                        onChangeText={props.priceChange}
                        value={props.priceValue === "0" || props.priceValue == null || props.priceValue == undefined ? "" : props.priceValue}
                        disabled={false}
                    />
                    <PriceInput
                        label="JS"
                        placeholder="0"
                        onChangeText={props.jsChange}
                        value={props.jsValue === "0" || props.jsValue == null || props.jsValue == undefined  ? "" : props.jsValue}
                        disabled={false}
                    />
                    <PriceInput
                        label="JP"
                        placeholder="0"
                        onChangeText={props.jpChange}
                        value={props.jpValue === "0" || props.jpValue == null || props.jpValue == undefined  ? "" : props.jpValue}
                        disabled={false}
                    />
                </div>
                {props.deleteAble ? 
                    <div onClick={props.onDelete} className="w-[30px] h-[48px] flex items-center justify-center mt-2 cursor-pointer">
                        <FontAwesomeIcon className="text-primary" icon={faTrashCan}/>
                    </div>
                : null}
            </div>
        </div>
    );
}