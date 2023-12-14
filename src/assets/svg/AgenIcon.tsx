interface IProps {
    fill?: string;
}
export const AgenIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.6801 4.01273C13.1601 4.72273 13.4401 5.57273 13.4401 6.49273C13.4301 8.89273 11.5401 10.8427 9.16006 10.9227C9.06006 10.9127 8.94006 10.9127 8.83006 10.9227C6.45006 10.8427 4.56006 8.89273 4.56006 6.49273C4.56006 4.04273 6.54006 2.05273 9.00006 2.05273" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.41 4.05273C18.35 4.05273 19.91 5.62273 19.91 7.55273C19.91 9.44273 18.41 10.9827 16.54 11.0527C16.46 11.0427 16.37 11.0427 16.28 11.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.15997 14.6127C1.73997 16.2327 1.73997 18.8727 4.15997 20.4827C6.90997 22.3227 11.42 22.3227 14.17 20.4827C16.59 18.8627 16.59 16.2227 14.17 14.6127C11.43 12.7827 6.91997 12.7827 4.15997 14.6127Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.34 20.0527C19.06 19.9027 19.74 19.6127 20.3 19.1827C21.86 18.0127 21.86 16.0827 20.3 14.9127C19.75 14.4927 19.08 14.2127 18.37 14.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}