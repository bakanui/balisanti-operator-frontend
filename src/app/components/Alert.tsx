import { Button } from './Button';
import { CustomModal } from './CustomModal';

interface IProps {
    title: string;
    content: string;
    isOpen: boolean;
    closeAlert: () => void;
    confirmAlert: ()=> void;
    confirmText?: string;
    cancelText?: string;
}
export const Alert = ({
    title,
    content,
    isOpen,
    closeAlert,
    confirmAlert,
    confirmText,
    cancelText
}: IProps) => {
    return(
        <CustomModal 
            modalIsOpen={isOpen}
            closeModal={closeAlert}
        >
            <div className="sm:w-[25vw]">
                <span className="font-robotomedium text-lg dark:text-black">{title}</span>
                <div className="font-robotoregular text-sm mt-2: dark:text-black">{content}</div>
                <div className="flex justify-end mt-6">
                    <div className="flex w-[80%]">
                        <Button 
                            label={cancelText || 'Batal'}
                            outline
                            onClick={closeAlert}
                        />
                        <div className="ml-2"/>
                        <Button 
                            label={confirmText || "Simpan"}
                            onClick={confirmAlert}
                        />
                    </div>
                </div>
            </div>
        </CustomModal>
    );
}