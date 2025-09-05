import { LIMIT_SIZE } from "../config";
import { logStore$ } from "../store/logStore";
import { httpService } from "./httpService";

// const API_BASE = "api/api";

const baseUrl = "/api/api";
// import.meta.env.MODE === "development"
//   ? "/api/api"
//   : "https://blockstream.info/api";

export async function fetchAddressTxs(
  address: string,
  limit = LIMIT_SIZE,
  offset = 0
) {
  const url = `/address/${address}/txs`;
  const params = { limit, offset };

  try {
    const data = await httpService.get(`${baseUrl}${url}`, params);
    logStore$.addLog({
      url: `${baseUrl}${url}`,
      params,
      state: "success",
      resultCount: data.length,
    });
    return data;
  } catch (err) {
    logStore$.addLog({
      url: `${baseUrl}${url}`,
      params,
      state: "error",
      error: (err as Error).message,
    });
    throw err;
  }
}

// export async function fetchTxDetails(txid: string) {
//   const url = `/tx/${txid}`;
//   //   addLogEntry({ url: `${API_BASE}${url}`, state: "loading" });
//   // eslint-disable-next-line no-useless-catch
//   try {
//     const { data } = await httpService.get(`${API_BASE}${url}`);
//     // addLogEntry({ url: `${API_BASE}${url}`, state: "success" });
//     return data;
//   } catch (err) {
//     // addLogEntry({
//     //   url: `${API_BASE}${url}`,
//     //   state: "error",
//     //   error: (err as Error).message,
//     // });
//     throw err;
//   }
// }
