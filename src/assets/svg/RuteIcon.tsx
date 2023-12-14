interface IProps {
    fill?: string;
}
export const RuteIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.45 6.05273L20.9999 6.07275" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 18.0327L5.54999 18.0427C6.45999 18.0427 7.31 17.5927 7.81 16.8427L8.98999 15.0728L9.75 13.9327L13.67 8.05273" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M19 20.0327L21 18.0327" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8.89001 8.6729L7.81 7.1729C7.3 6.4629 6.47999 6.04291 5.60999 6.05291L3 6.06292" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12.97 15.4326L14.19 17.0026C14.7 17.6626 15.5 18.0526 16.34 18.0526L21.01 18.0326" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 6.07275L19 4.07275" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
}