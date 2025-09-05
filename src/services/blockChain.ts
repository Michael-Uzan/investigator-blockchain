import { httpService } from "./httpService";
// import { addLogEntry } from "../hooks/useLegendState";

const API_BASE = "api/api";

// const client: AxiosInstance = axios.create({
//   baseURL: API_BASE,
//   timeout: 10000,
// });

export async function fetchAddressTxs(address: string, limit = 10, offset = 0) {
  console.log("🚀 ~ fetchAddressTxs ~ address:", address);
  const url = `/address/${address}/txs`;
  const params = { limit, offset };
  //   addLogEntry({ url: `${API_BASE}${url}`, params, state: "loading" });
  // eslint-disable-next-line no-useless-catch
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const { data } = await client.get<any[]>(url, { params });
    const data = await httpService.get(`${API_BASE}${url}`, params);
    console.log("🚀 ~ fetchAddressTxs ~ data:", data);
    // addLogEntry({
    //   url: `${API_BASE}${url}`,
    //   params,
    //   state: "success",
    //   resultCount: data.length,
    // });
    return data;
  } catch (err) {
    // addLogEntry({
    //   url: `${API_BASE}${url}`,
    //   params,
    //   state: "error",
    //   error: (err as Error).message,
    // });
    throw err;
  }
}

export async function fetchTxDetails(txid: string) {
  const url = `/tx/${txid}`;
  //   addLogEntry({ url: `${API_BASE}${url}`, state: "loading" });
  // eslint-disable-next-line no-useless-catch
  try {
    const { data } = await httpService.get(`${API_BASE}${url}`);
    // addLogEntry({ url: `${API_BASE}${url}`, state: "success" });
    return data;
  } catch (err) {
    // addLogEntry({
    //   url: `${API_BASE}${url}`,
    //   state: "error",
    //   error: (err as Error).message,
    // });
    throw err;
  }
}
