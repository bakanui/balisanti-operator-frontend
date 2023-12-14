import { IPembayaranHistory } from "@/app/types/jadwal"
import { parseDateIncludeHours } from "@/app/utils/utility";
import { TextBetweenLabel } from "./TextBetweenLabel";

interface IProps {
    history: IPembayaranHistory[];
}
export const TransactionHistory = (props: IProps) => {
    return(
        <>
            <div className="text-lg font-robotobold mr-4 mb-3">Riwayat transaksi</div>
            {props.history.map((item, index)=> {
                return(
                    <>
                    <TextBetweenLabel
                        key={index+''+item.created_at}
                        title={parseDateIncludeHours(new Date(item.created_at), false)}
                        prefix={item.ket}
                        size="xs"
                    />
                    <div className="mb-3"/>
                    </>
                );
            })}
        </>
    );
}