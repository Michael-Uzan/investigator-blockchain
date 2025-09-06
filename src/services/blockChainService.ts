import { LIMIT_SIZE } from "../config";
import { logStore$ } from "../store/logStore";
import { httpService } from "./httpService";

const baseUrl =
  import.meta.env.MODE === "development" ? "/api/api" : "/api/blockstream";

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
