import axios from 'axios';

export const api = axios.create({
    baseURL: `${process.env.REACT_APP_URL_TOKEN_RECAPTCHA_VALIDATE}`,
    headers: {
        "Content-type": "application/json"
      }
});