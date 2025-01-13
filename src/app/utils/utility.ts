import { env } from "process";

const mm = [
    '',
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const timeList = [
    { value: '00:00', label: '00:00' },
    { value: '00:30', label: '00:30' },
    { value: '00:45', label: '00:45' },
    { value: '01:00', label: '01:00' },
    { value: '01:30', label: '01:30' },
    { value: '01:45', label: '01:45' },
    { value: '02:00', label: '02:00' },
    { value: '02:30', label: '02:30' },
    { value: '02:45', label: '02:45' },
    { value: '03:00', label: '03:00' },
    { value: '03:30', label: '03:30' },
    { value: '03:45', label: '03:45' },
    { value: '04:00', label: '04:00' },
    { value: '04:30', label: '04:30' },
    { value: '04:45', label: '04:45' },
    { value: '05:00', label: '05:00' },
    { value: '05:30', label: '05:30' },
    { value: '05:45', label: '05:45' },
    { value: '06:00', label: '06:00' },
    { value: '06:30', label: '06:30' },
    { value: '06:45', label: '06:45' },
    { value: '07:00', label: '07:00' },
    { value: '07:30', label: '07:30' },
    { value: '07:45', label: '07:45' },
    { value: '08:00', label: '08:00' },
    { value: '08:30', label: '08:30' },
    { value: '08:45', label: '08:45' },
    { value: '09:00', label: '09:00' },
    { value: '09:30', label: '09:30' },
    { value: '09:45', label: '09:45' },
    { value: '10:00', label: '10:00' },
    { value: '10:30', label: '10:30' },
    { value: '10:45', label: '10:45' },
    { value: '11:00', label: '11:00' },
    { value: '11:30', label: '11:30' },
    { value: '11:45', label: '11:45' },
    { value: '12:00', label: '12:00' },
    { value: '12:30', label: '12:30' },
    { value: '12:45', label: '12:45' },
    { value: '13:00', label: '13:00' },
    { value: '13:30', label: '13:30' },
    { value: '13:45', label: '13:45' },
    { value: '14:00', label: '14:00' },
    { value: '14:30', label: '14:30' },
    { value: '14:45', label: '14:45' },
    { value: '15:00', label: '15:00' },
    { value: '15:30', label: '15:30' },
    { value: '15:45', label: '15:45' },
    { value: '16:00', label: '16:00' },
    { value: '16:30', label: '16:30' },
    { value: '16:45', label: '016:45' },
    { value: '17:00', label: '17:00' },
    { value: '17:30', label: '17:30' },
    { value: '17:45', label: '17:45' },
    { value: '18:00', label: '18:00' },
    { value: '18:30', label: '18:30' },
    { value: '18:45', label: '18:45' },
    { value: '19:00', label: '19:00' },
    { value: '19:30', label: '19:30' },
    { value: '19:45', label: '19:45' },
    { value: '20:00', label: '20:00' },
    { value: '20:30', label: '20:30' },
    { value: '20:45', label: '20:45' },
    { value: '21:00', label: '21:00' },
    { value: '21:30', label: '21:30' },
    { value: '22:45', label: '22:45' },
    { value: '22:00', label: '22:00' },
    { value: '22:30', label: '22:30' },
    { value: '23:45', label: '23:45' },
    { value: '23:00', label: '23:00' },
    { value: '23:30', label: '23:30' },
    { value: '23:45', label: '23:45' }
];
  
  export const addCommas = (num: string) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  export const removeNonNumeric = (num: string) => num.toString().replace(/[^0-9]/g, "");
  
  export const convertLabelToPrice = (price: string) => {
    return addCommas(removeNonNumeric(price));
  }
  
  export const generateDateAsCode = (date: Date) => {
        var tanggal = (date.getDate() < 10 ? '0' : '') + date.getDate(),
          bulan = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1),
          tahun = date.getFullYear();
        return `${tahun}${bulan}${tanggal}`;
  };
  
  export const convertLabelPriceToNumeberPrice = (price: string) => {
    if (!price || price == '0') {
      return 0;
    }
    let p = `${price}`;
    p = price.replaceAll('.', '');
    p = p.replaceAll(',','.');
    return parseFloat(p);
  }

  export const jenisPenumpangSpawner = (jenis: string) => {
    if (jenis === 'Domestik') {
      return parseInt("1");
    } else if (jenis === 'Mancanegara') {
      return parseInt("2");
    } else if (jenis === 'Lokal') {
      return parseInt("3");
    } else if (jenis === 'Domestik (PP)') {
      return parseInt("4");
    } else if (jenis === 'Mancanegara (PP)') {
      return parseInt("5");
    } else if (jenis === 'Lokal (PP)') {
      return parseInt("6");
    } else if (jenis === 'Golongan I') {
      return parseInt("7");
    } else if (jenis === 'Golongan II') {
      return parseInt("8");
    } else if (jenis === 'Golongan III') {
      return parseInt("9");
    } else if (jenis === 'Golongan IV') {
      return parseInt("10");
    } else if (jenis === 'Golongan V') {
      return parseInt("11");
    } else if (jenis === 'Golongan VI') {
      return parseInt("12");
    } else if (jenis === 'Golongan VII') {
      return parseInt("13");
    }
  }
  
  export const parseDateIncludeHours = (date: Date, dateOnly: boolean) => {
    var tanggal = (date.getDate() < 10 ? '0' : '') + date.getDate(),
      bulan = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1),
      tahun = date.getFullYear();
  
    var hours = (date.getHours() < 10 ? '0' : '') + date.getHours(),
      minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

    var daysNumber = date.getDay();
  
    if (dateOnly) {
      return (
        tanggal + ' ' + mm[parseInt(bulan)] + ' ' + tahun
      );
    }  
    return (
      days[daysNumber]+', '+ tanggal + ' ' + mm[parseInt(bulan)] + ' ' + tahun + ` ${hours}:${minutes}`
    );
  };
  
  export const parseDateToBackendFormat = (date: Date) => {
    var tanggal = (date.getDate() < 10 ? '0' : '') + date.getDate(),
      bulan = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1),
      tahun = date.getFullYear();
    return `${tahun}-${bulan}-${tanggal}`;
  }

  export const parseDateToShortFormat = (date: Date) => {
    var day = date.getDate().toString().padStart(2, '0');
    var month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    var year = date.getFullYear();
  
    return `${day}${month}${year}`;
  }
  
  export const daysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  }
  
  export const getFirstAndLastDate = () => {
    let date = new Date();
    date.setDate(1);
    let lastDate = daysInMonth(date.getMonth() + 1, date.getFullYear());
    let tmpLastDate = new Date();
    tmpLastDate.setDate(lastDate);
    return {first: date, last: tmpLastDate};
  }
  
  export const getFirstDateInYear = () => {
    let date = new Date();
    date.setDate(1);
    date.setMonth(0);
    return date;
  }
  
  export const errorHandler = (err: any, unauth?: ()=> void) => {
    if (err.response) {
      if (err.response.status == 401) {
        unauth && unauth();
        return 'Email atau Password tidak ditemukan';
      }
      // error from server
      let errorData: any[] = [];
      const error = err.response.data.error;
      if (typeof error == 'string') {
        return error;
      }
      if (err.response.data.message) {
        return err.response.data.message;
      }
      
      Object.keys(err.response.data.error).forEach((key)=>{
        errorData.push({'key': key});
      });
      let data = errorData.map((item:any)=> {
        return err.response.data.error[item.key];
      });
      return data.join('\n');
    } else if (err.request) {
      return err.request;
    } 
    else {
      return err.message;
    }
  }

  export const toastErrorConfig: any = 
  {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
  };

  export const toastSuccessConfig: any = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }

  export const generatePassword =()=> {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    console.log(retVal);
    
    return retVal;
  }
  
export const isBeforeCurrentTime = (inpTime: String): boolean => {
  const currentDate = new Date();
  // Split the time string into hours and minutes
  const [hours, minutes] = inpTime.split(':').map(Number);

  // Create a new Date object with the given date and time
  const resultDate = new Date();
  resultDate.setHours(hours, minutes, 0, 0);

  // Extract time components from inputDate
  const inputHours = resultDate.getHours();
  const inputMinutes = resultDate.getMinutes();
  const inputSeconds = resultDate.getSeconds();

  // Extract time components from current date
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const currentSeconds = currentDate.getSeconds();

  // Compare time components
  if (inputHours < currentHours) {
      return true;
  } else if (inputHours === currentHours) {
      if (inputMinutes < currentMinutes) {
          return true;
      } else if (inputMinutes === currentMinutes) {
          return inputSeconds < currentSeconds;
      }
  }

  return false;
};
  
export const isBeforeCurrentDate = (inputDate: Date): boolean => {
  const currentDate = new Date();
  const inputDateWithoutTime = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate()
  );
  return inputDateWithoutTime <= currentDate;
};

export const isSameDate = (dateA: Date, dateB: Date): boolean => {
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  );
}