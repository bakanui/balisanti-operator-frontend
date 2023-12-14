interface IProps {
    fill?: string;
}
export const ShipStoreIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.10997 20.5129C3.93997 19.5429 3.13999 18.1729 2.77999 16.5729L2.36998 14.7129C2.16998 13.8029 2.70997 12.7729 3.57997 12.4229L4.99999 11.8529L10.51 9.64291C11.47 9.26291 12.53 9.26291 13.49 9.64291L19 11.8529L20.42 12.4229C21.29 12.7729 21.83 13.8029 21.63 14.7129L21.22 16.5729C20.51 19.7729 18 22.0529 14.38 22.0529H9.61998" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 22.0527V10.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 8.05273V11.8527L13.49 9.64273C12.53 9.26273 11.47 9.26273 10.51 9.64273L5 11.8527V8.05273C5 6.40273 6.35 5.05273 8 5.05273H16C17.65 5.05273 19 6.40273 19 8.05273Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.5 5.05273H9.5V3.05273C9.5 2.50273 9.95 2.05273 10.5 2.05273H13.5C14.05 2.05273 14.5 2.50273 14.5 3.05273V5.05273Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}