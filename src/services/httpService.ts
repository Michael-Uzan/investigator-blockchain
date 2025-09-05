/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const httpService = {
  get(url: string, data: string | any | null = null) {
    return ajax(url, "GET", data);
  },
  post(url: string, data: string | any | null = null) {
    return ajax(url, "POST", data);
  },
  put(url: string, data: string | any | null = null) {
    return ajax(url, "PUT", data);
  },
  delete(url: string, data: string | any | null = null) {
    return ajax(url, "DELETE", data);
  },
};

async function ajax(
  url: string,
  method: string = "GET",
  data: string | any | null
): Promise<any | any[]> {
  try {
    const res = await axios({
      url,
      method,
      data,
      params: method === "GET" ? data : null,
    });

    return res.data;
  } catch (err) {
    console.log(
      `Had Issues ${method}ing to the backend, endpoint: ${url}, with data: ${data}`
    );
    console.dir(err);
    throw err;
  }
}
