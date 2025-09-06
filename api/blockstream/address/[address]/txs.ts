import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { address } = req.query;
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  try {
    const response = await axios.get(
      `https://blockstream.info/api/address/${address}/txs`,
      {
        params: { limit, offset },
      }
    );

    res.status(200).json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
