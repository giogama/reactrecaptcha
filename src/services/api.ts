import axios from 'axios';

export const api = axios.create({
    baseURL: `${process.env.REACT_APP_URL_RECAPTCHA_VALIDATE as string}`,
    headers: {
        "Content-type": "application/json"
      }
});