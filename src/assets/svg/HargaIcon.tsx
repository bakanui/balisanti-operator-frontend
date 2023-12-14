interface IProps {
    fill?: string;
}
export const HargaIcon = (props: IProps) => {
    return(
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.67188 14.3826C8.67188 15.6726 9.66188 16.7126 10.8919 16.7126H13.4019C14.4719 16.7126 15.3419 15.8026 15.3419 14.6826C15.3419 13.4626 14.8119 13.0326 14.0219 12.7526L9.99187 11.3526C9.20187 11.0726 8.67188 10.6426 8.67188 9.42258C8.67188 8.30258 9.54187 7.39258 10.6119 7.39258H13.1219C14.3519 7.39258 15.3419 8.43258 15.3419 9.72258" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 6.05273V18.0527V6.05273Z" fill="#3E3E3F"/>
        <path d="M12 6.05273V18.0527" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 22.0527H9C4 22.0527 2 20.0527 2 15.0527V9.05273C2 4.05273 4 2.05273 9 2.05273H15C20 2.05273 22 4.05273 22 9.05273V15.0527C22 20.0527 20 22.0527 15 22.0527Z" stroke={props.fill || "#3E3E3F"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
    );
}