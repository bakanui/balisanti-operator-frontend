import LoadingAnimation from '../../assets/animations/empty.json';
import Lottie from "lottie-react";

interface IProps {
    title: string;
    subtitle?: string;
}

export const Empty = (props: IProps) => {
    return(
        <div className='flex flex-col items-center justify-center w-full mb-2'>
            <Lottie animationData={LoadingAnimation} style={{
                height: 180,
            }}/>
            <span className='font-robotomedium text-md'>{props.title}</span>
            <span className='font-robotoregular text-xs'>{props.subtitle}</span>
        </div>
    );
}