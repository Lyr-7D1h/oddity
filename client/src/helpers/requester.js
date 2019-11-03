import axios from "axios";

const baseUrl = "/api/";

const post = (route, data) => {
  axios
    .post(baseUrl + route, data)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(err);
    });
};

const get = route => {
  return new Promise((resolve, reject) => {
    axios
      .get(baseUrl + route)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default {
  post,
  get
};
