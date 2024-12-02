import { IPenumpangOption } from "@/app/pembayaran-agen/components/PenumpangListKeberangkatan";
import { convertLabelToPrice, parseDateIncludeHours } from "@/app/utils/utility";
import React from "react";
import logos from './../../../assets/tiket-header.png';
import { IHargaService } from "@/app/types/hargaService";

export type IServiceOption = Partial<IHargaService>
   & { selected: boolean }

interface IProps {
    penumpang: IPenumpangOption[];
    service?: IServiceOption[];
    agen?: any;
    collect?: string;
    dermaga_awal?: string;
    dermaga_tujuan?: string;
    waktu_berangkat?: string;
}

const ComponentToPrint = React.forwardRef((props: IProps, ref: any) => {
    return (
        <div ref={ref}>
            {props.penumpang.map((item)=> {
                if (item.selected) {
                    return(
                        <div key={item.kode_booking} className="w-[400px]">
                            <br/>
                            <br/>
                            <img src={logos.src}/>
                            <div className="flex justify-center items-center flex-col p-2">
                                <img className="w-[200px] h-[200px] mt-2" src={item.qrcode}/>
                                <div className="font-bold mt-4 text-lg">
                                    Booking ID
                                    ({item.keterangan ? (item.keterangan == 'GO' ? 'OW' : 'RT') : ''})
                                </div>
                                <div className="text-lg">
                                    {item.kode_booking} 
                                </div>
                                <br/>
                                <div className="font-bold text-lg">Booking Date</div>
                                <div className="text-md">{parseDateIncludeHours(new Date(item.tanggal || ''), true)}</div>
                                <br/>
                                <table className="text-md">
                                    <tbody>
                                        {/* props.agent if not null  print agen.nama_agen */}
                                        {props.agen && (                                        
                                            <tr>
                                                <td>Agent Name </td>
                                                <td className="font-bold pl-2">: {props.agen.nama_agen}</td>
                                            </tr>
                                        )}
                                        {!props.agen && (
                                            <tr>
                                                <td>Agent Name </td>
                                                <td className="font-bold pl-2">: -</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td>Passenger Name </td>
                                            <td className="font-bold pl-2">: {item.nama_penumpang}</td>
                                        </tr>
                                        <tr>
                                            <td>From </td>
                                            <td className="font-bold pl-2">: {item.dermaga_awal}</td>
                                        </tr>
                                        <tr>
                                            <td>To </td>
                                            <td className="font-bold pl-2">: {item.dermaga_tujuan}</td>
                                        </tr>
                                        <tr>
                                            <td>Date</td>
                                            <td className="font-bold pl-2">: {item.waktu_berangkat}</td>
                                        </tr>
                                        {props.collect && (
                                            <tr>
                                                <td>Collect</td>
                                                <td className="font-bold pl-2">: Rp. {convertLabelToPrice(`${props.collect}`)}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <br/>
                            <br/>
                        </div>
                    );
                }
                return null;
            })}
            {props.service ? props.service.map((item)=> {
                if (item.selected) {
                    return(
                        <div key={item.kode_barang} className="w-[400px]">
                            <br/>
                            <br/>
                            <img src={logos.src}/>
                            <div className="flex justify-center items-center flex-col p-2">
                                <img className="w-[200px] h-[200px] mt-2" src={item.qrcode}/>
                                <div className="font-bold mt-4 text-lg">
                                    Kode Barang
                                </div>
                                <div className="text-lg">
                                    {item.kode_barang} 
                                </div>
                                <br/>
                                <div className="font-bold text-lg">Jenis Barang</div>
                                <div className="text-md">{item.jenis_barang}</div>
                                <br/>
                                <table className="text-md">
                                    <tbody>
                                        <tr>
                                            <td>Barang </td>
                                            <td className="font-bold pl-2">: {item.nama_barang}</td>
                                        </tr>
                                        <tr>
                                            <td>Jumlah </td>
                                            <td className="font-bold pl-2">: {item.qty}</td>
                                        </tr>
                                        <tr>
                                            <td>Keberangkatan </td>
                                            <td className="font-bold pl-2">: {item.dermaga_awal}</td>
                                        </tr>
                                        <tr>
                                            <td>Kedatangan </td>
                                            <td className="font-bold pl-2">: {item.dermaga_tujuan}</td>
                                        </tr>
                                        <tr>
                                            <td>Tanggal</td>
                                            <td className="font-bold pl-2">: {item.tanggal}</td>
                                        </tr>
                                        {/* {props.collect && (
                                            <tr>
                                                <td>Collect</td>
                                                <td className="font-bold pl-2">: Rp. {convertLabelToPrice(`${props.collect}`)}</td>
                                            </tr>
                                        )} */}
                                    </tbody>
                                </table>
                            </div>
                            <br/>
                            <br/>
                        </div>
                    );
                }
                return null;
            }): ''}
        </div>
    );
  });

  ComponentToPrint.displayName = 'ComponentToPrint';
  export default ComponentToPrint;