import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { useEffect, useState } from 'react';
  import { Bar } from 'react-chartjs-2';
import { parseDateIncludeHours } from '../utils/utility';
import { Loading } from './Loading';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  const options = {
    responsive: true,
    options: {
      
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
        text: 'title',
      },
    },
  };
  
  const labels = ['26 Jan 2023'];
  
  const dataSets = {
    labels,
    datasets: [
      {
        label: 'Pembayaran Tunai',
        data: labels.map(() => 35000000),
        backgroundColor: '#008AA1',
        barPercentage: 0.3,
        categoryPercentage: 1,
      },
      {
        label: 'Pembayaran Non Tunai',
        data: labels.map(() => 25000000),
        backgroundColor: '#48CF8E',
        barPercentage: 0.3,
        categoryPercentage: 1,
      },
    ],
  };
interface IPembayaranChartProps {
    pembayaran: any;
}
export const PembayaranChart = (props: IPembayaranChartProps) => {
    const [chartLabels, setChartLabel] = useState<string[]>([]);
    const [chartData, setChartData] = useState<any>({
        labels: chartLabels,
        datasets: []
    });

    useEffect(()=> {
        if (props.pembayaran) {
            let keys = Object.keys(props.pembayaran),
            keysUsed = keys.map((item)=> parseDateIncludeHours(new Date(item), true));
            let tunai = [], nonTunai = [];
            for(let i = 0; i < keys.length; i++) {
                const tmpTunai = parseFloat(props.pembayaran[keys[i]].tunai),
                tmpNonTunai = parseFloat(props.pembayaran[keys[i]].non_tunai);
                tunai.push(tmpTunai);
                nonTunai.push(tmpNonTunai);
            }
            setChartLabel(keys);
            setChartData({
                labels: keysUsed,
                datasets: [
                    {
                      label: 'Pembayaran Tunai',
                      data: tunai,
                      backgroundColor: '#008AA1',
                      barPercentage: 0.3,
                      categoryPercentage: 1,
                    },
                    {
                      label: 'Pembayaran Non Tunai',
                      data: nonTunai,
                      backgroundColor: '#48CF8E',
                      barPercentage: 0.3,
                      categoryPercentage: 1,
                    },
                  ],
            });
        }
    },[props.pembayaran]);

    return(
        <div className='w-full'>
            {props.pembayaran ? 
                <Bar 
                    options={options} 
                    data={chartData} 
                    height={100}
                />
            : 
                <Loading 
                    title='Mohon menunggu...'
                    loading
                />
            }
        </div>
    );
}