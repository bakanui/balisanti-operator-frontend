import { IAuth } from "../types/auth";
import { API_AUTH } from "../utils/api";
import axios from 'axios';
import { errorHandler } from "../utils/utility";

export const loginAction = (
    username: string,
    password: string,
    onSuccess: (data: IAuth) => void,
    onFailed: (error:any) => void
) => {
    axios.post<IAuth>(API_AUTH.LOGIN, {
        email: username,
        password
    })
    .then((response)=> {
        console.log(response.data);
        onSuccess(response.data);
    })
    .catch(function (error) {
        console.log(error);
        let err = errorHandler(error);
        onFailed(err);
    });
}