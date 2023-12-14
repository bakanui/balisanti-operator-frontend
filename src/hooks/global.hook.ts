import { useRouter } from "next/navigation"
import { errorHandler } from '@/app/utils/utility';
import { useEffect, useState } from "react";
import { IAuth } from "@/app/types/auth";
import { getStorageValue } from "@/app/utils/localstoreage";
import { toast } from "react-toastify";

export const useAuth = () => {
    const [token, setToken] = useState('');
    const {toLogin} = useError();

    useEffect(()=> {
        const auth: IAuth = getStorageValue('auth');
        
        if (auth && auth.authorisation && auth.authorisation.token) {
            setToken(auth.authorisation.token);
            console.log('TOKEN = ', auth.authorisation.token);
        } else {
            toLogin();
        }
    }, []);
    return [token]
}

export const useError = () => {
    const router = useRouter();
    const handleError = (error: any)=> {
        if (error) {
            let err = errorHandler(error, ()=> {
                router.replace('/login');
                return;
            });
            toast.error(err);
        }
    }

    const toLogin = ()=> {
        router.replace('/login');
    }

    return {handleError, toLogin}
}