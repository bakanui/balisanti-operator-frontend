import { IHargaTiket } from "@/app/types/jadwal";

interface IProps {
    hargaTiket?: IHargaTiket[];
}

// Ringkasan kuota per jenis penumpang untuk satu jadwal di tabel list.
export const KuotaTiketCell = ({ hargaTiket }: IProps) => {
    const items = hargaTiket || [];
    if (items.length == 0) {
        return <span className="text-xs text-gray-400 font-robotoregular">-</span>;
    }
    if (items.every((item)=> item.kuota == null)) {
        return <span className="text-xs text-gray-400 font-robotoregular whitespace-nowrap">Tanpa batas</span>;
    }
    return(
        <div className="flex flex-col gap-1 py-1">
            {items.map((item)=> (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs font-robotoregular whitespace-nowrap">
                    <span className="text-gray-600 dark:text-gray-300">{item.tipe_penumpang} - {item.jenis_penumpang}</span>
                    {item.kuota == null ?
                        <span className="text-gray-400">∞</span>
                    :
                        <span className="min-w-[32px] text-center rounded-full bg-primary/10 text-primary font-robotomedium px-2">{item.kuota}</span>
                    }
                </div>
            ))}
        </div>
    );
}
