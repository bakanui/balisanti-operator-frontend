import { Button } from "./Button";

interface IProps {
    onCancel?: () => void;
    onConfirm?: () => void;
    cancelText?: string;
    confirmText?: string;
    noHeight?: boolean;
}

export const ButtonGroup = (props: IProps) => {
    return(
        <div className={`${props.noHeight? undefined : 'h-[6rem]'} flex flex-row items-center justify-end`}>
            <div className="w-[8rem]">
                <Button 
                    label={props.cancelText ||  "Batal"}
                    outline={true}
                    onClick={props.onCancel}
                />
            </div>
            <div className="w-[8rem] ml-4">
                <Button 
                    label={props.confirmText ||  "Simpan"}
                    onClick={props.onConfirm}
                />
            </div>
        </div>
    );
}