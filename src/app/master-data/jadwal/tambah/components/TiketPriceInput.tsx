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
    kuotaValue: string;
    kuotaChange: (text: string)=> void;
    kirimValue: boolean;
    kirimChange: (value: boolean)=> void;
    nomor?: number;
}
export const TiketPriceInput = (props: IProps) => {
    return(
        <div className={`mb-5 rounded-xl border ${props.kirimValue ? 'border-gray-200' : 'border-dashed border-gray-300'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-t-xl bg-gray-50 dark:bg-slate-700 border-b border-gray-200">
                <div className="flex items-center gap-3 min-w-0">
                    {props.nomor ?
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-white text-xs font-robotomedium shrink-0">{props.nomor}</span>
                    : null}
                    <span className="font-robotomedium text-sm truncate">{props.value?.value ? props.value.label : 'Tiket baru'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none" title="Kirim harga tiket ini ke Siwalatri">
                        <span className={`text-xs font-robotoregular ${props.kirimValue ? 'text-primary' : 'text-gray-500'}`}>
                            {props.kirimValue ? 'Dikirim ke Siwalatri' : 'Tidak dikirim ke Siwalatri'}
                        </span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={props.kirimValue}
                            onClick={()=> props.kirimChange(!props.kirimValue)}
                            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${props.kirimValue ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${props.kirimValue ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}/>
                        </button>
                    </label>
                    {props.deleteAble ?
                        <button type="button" onClick={props.onDelete} title="Hapus tiket" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50">
                            <FontAwesomeIcon className="text-primary" icon={faTrashCan}/>
                        </button>
                    : null}
                </div>
            </div>
            <div className="px-5 pt-4">
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
                <div className="sm:flex sm:flex-col w-[130px] shrink-0" style={{marginLeft: 10}}>
                    <div className="font-robotomedium mb-2 text-sm whitespace-nowrap" title="Kosongkan jika tanpa batas">Kuota Tiket</div>
                    <input
                        value={props.kuotaValue ?? ''}
                        onChange={(e)=> props.kuotaChange(e.target.value.replace(/[^0-9]/g, ''))}
                        className="text-input text-sm mb-4 border-primary"
                        placeholder="∞ Tanpa batas"
                        title="Kosongkan jika tanpa batas"
                        inputMode="numeric"
                    />
                </div>
            </div>
            </div>
        </div>
    );
}