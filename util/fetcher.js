import axios from "axios";

export const fetcher = (url) => {
  return axios(url).then((res) => res.data);
}
