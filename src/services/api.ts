import axios from 'axios';

const urlBase = process.env.REACT_APP_URL_RECAPTCHA_VALIDATE as string;

console.log(urlBase, 'urlBase');

export const api = axios.create({
    baseURL: `${urlBase}`,
    headers: {
        "Content-type": "application/json"
      }
});