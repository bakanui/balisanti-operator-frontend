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
    jrValue: string;
    jrChange: (text: string)=> void;
    jpkValue: string;
    jpkChange: (text: string)=> void;
    jpbValue: string;
    jpbChange: (text: string)=> void;
    passValue: string;
    passChange: (text: string)=> void;
    dermagaValue: string;
    dermagaChange: (text: string)=> void;
}
export const TiketPriceInput = (props: IProps) => {
    return(
        <div className="sm:grid">
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
                    value={String(Number(props.priceValue?.replace('.', '')) + Number(props.jrValue?.replace('.', '')) + Number(props.jpkValue?.replace('.', '')) + Number(props.jpbValue?.replace('.', '')) + Number(props.passValue?.replace('.', '')) + Number(props.dermagaValue?.replace('.', '')))}
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
                        label="JR"
                        placeholder="0"
                        onChangeText={props.jrChange}
                        value={props.jrValue === "0" || props.jrValue == null || props.jrValue == undefined  ? "" : props.jrValue}
                        disabled={false}
                    />
                    <PriceInput
                        label="ATJP-K"
                        placeholder="0"
                        onChangeText={props.jpkChange}
                        value={props.jpkValue === "0" || props.jpkValue == null || props.jpkValue == undefined  ? "" : props.jpkValue}
                        disabled={false}
                    />
                    <PriceInput
                        label="ATJP-B"
                        placeholder="0"
                        onChangeText={props.jpbChange}
                        value={props.jpbValue === "0" || props.jpbValue == null || props.jpbValue == undefined  ? "" : props.jpbValue}
                        disabled={false}
                    />
                    <PriceInput
                        label="Pass Masuk"
                        placeholder="0"
                        onChangeText={props.passChange}
                        value={props.passValue === "0" || props.passValue == null || props.passValue == undefined  ? "" : props.passValue}
                        disabled={false}
                    />
                    <PriceInput
                        label="Dermaga"
                        placeholder="0"
                        onChangeText={props.dermagaChange}
                        value={props.dermagaValue === "0" || props.dermagaValue == null || props.dermagaValue == undefined  ? "" : props.dermagaValue}
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