import { api } from "./api";

interface IResponseRecaptcha {
    returnCode: number;
    message:string;
    hasError: boolean;
    hasException: boolean;        
};

export const isHuman = async (accessToken:string, reToken:string): Promise<boolean> => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${accessToken}` }
        };

        const response = await api.post<IResponseRecaptcha>(`${process.env.REACT_APP_SERVICE_RECAPTCHA_VALIDATE as string}`,
            JSON.stringify(
            {
                tokenReCaptcha: reToken
            }),
            config
        );

        if (response.data.returnCode === 0)
            return true;
        
        return false;

    } catch(err) {
        throw err;
    }
}