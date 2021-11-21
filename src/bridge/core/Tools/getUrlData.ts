import axios from 'axios';
import { stringify } from 'qs';

interface PostInterface {
  url: string;
  params?: any;
}

export const postUrlData = ({ url, params }: PostInterface) => {
  return new Promise((resolve) => {
    axios
      .post(url, stringify(params))
      .then((res) => {
        // axios.post(url, parse(params)).then(res => {
        resolve(res.data);
      })
      .catch((err) => {
        resolve({
          msg: 'Error',
          error: err,
        });
      });
  });
};

export function getUrlData({ url, params }: PostInterface) {
  return new Promise((resolve) => {
    let formatUrl = url;
    if (params) {
      const arr: any = [];
      for (const key in params) {
        arr.push(key + '=' + params[key]);
      }
      formatUrl += arr.length > 0 ? '?' + arr.join('&') : '';
    }
    axios
      .get(formatUrl)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        resolve({
          msg: 'Error',
          error: err,
        });
      });
  });
}
