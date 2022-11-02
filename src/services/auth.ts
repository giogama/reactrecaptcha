
import { api } from "./api";

interface IResponseLogin {
    returnCode: number;
    message: string;
    hasError: boolean;
    hasException: boolean;
    errorMessage: string;
    model: {
        authenticated: boolean;
        accessToken: string;
    }
}

export const processLogin = async (): Promise<string> => {
    try {
        
        const response = await api.post<IResponseLogin>(`${process.env.REACT_APP_SERVICE_LOGIN as string}`,
            JSON.stringify(
            {
                appkey: `${process.env.REACT_APP_API_APP as string}`,
                userId: `${process.env.REACT_APP_USER_ID as string}`,
                accessKey: `${process.env.REACT_APP_ACCESS_KEY as string}`
            })
        );

        var accessToken:string = '';

        if (response.data)
        {
            accessToken= response.data.model.accessToken;
        }

        return await Promise.resolve(accessToken);

    } catch(err) {
        throw err;
    }
}