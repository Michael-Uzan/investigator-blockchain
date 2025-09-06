export type IApiLog = {
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  state: "loading" | "success" | "error";
  error?: string;
  resultCount?: number;
};
