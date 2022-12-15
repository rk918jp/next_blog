import axios from "axios";

const sleep = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(undefined);
    }, 1000);
  });
}

const requestAsync = async () => {
  await sleep();
  // 直列リクエスト
  const res = await axios.get("https://google.com");
  const nextRes = await axios.get("https://yahoo.com");

  // 並列リクエスト
  const [res1, res2] = await Promise.all([
      axios.get("https://google.com"),
      axios.get("https://yahoo.com"),
  ])

  return res.data;
}

const request = () => {
  return sleep()
      .then(() => {
        return axios.get("http://google.com")
      })
      .then((res) => {
        return res.data;
      })
}

