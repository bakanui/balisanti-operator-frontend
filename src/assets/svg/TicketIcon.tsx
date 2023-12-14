interface IProps {
    fill?: string;
}
export const TicketIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.24001 15.3227C2.86001 15.4627 2.44001 15.5427 2.01001 15.5427C2.10001 19.1327 3.17001 20.0527 7.00001 20.0527H17C21 20.0527 22 19.0527 22 15.0527V9.05273C22 5.05273 21 4.05273 17 4.05273H7.00001C3.17001 4.05273 2.10001 4.97273 2.01001 8.55273C3.94001 8.55273 5.50001 10.1227 5.50001 12.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 4.05273V7.55273" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 16.5527V20.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.86 14.2626C14.74 14.2026 14.59 14.2026 14.47 14.2626L13.24 14.9126C12.93 15.0726 12.58 14.8126 12.64 14.4726L12.88 13.1026C12.9 12.9626 12.86 12.8326 12.76 12.7326L11.77 11.7626C11.52 11.5226 11.66 11.1026 12 11.0526L13.38 10.8526C13.52 10.8326 13.63 10.7526 13.69 10.6226L14.3 9.37264C14.45 9.06264 14.89 9.06264 15.04 9.37264L15.66 10.6226C15.72 10.7426 15.84 10.8326 15.97 10.8526L17.35 11.0526C17.69 11.1026 17.83 11.5226 17.58 11.7626L16.58 12.7326C16.48 12.8226 16.44 12.9626 16.46 13.1026" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}