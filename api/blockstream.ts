import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { address, limit = 10, offset = 0 } = req.query;

    const response = await axios.get(
      `https://blockstream.info/api/address/${address}/txs`,
      {
        params: { limit, offset },
      }
    );

    res.status(200).json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
}
