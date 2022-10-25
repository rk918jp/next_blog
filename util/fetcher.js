import axios from "axios";

export const fetcher = (url, params) => {
  return axios(url).then((res) => res.data);
}
