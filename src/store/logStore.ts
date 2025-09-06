import { observable } from "@legendapp/state";
import type { IApiLog } from "../types/IApiLog";

export const logStore$ = observable({
  logs: [] as IApiLog[],

  // Computed helpers
  logCount: () => logStore$.logs.get().length,

  // Actions
  addLog: (log: IApiLog) => {
    const logs = logStore$.logs.get();
    logStore$.logs.set([log, ...logs].slice(0, 200));
  },

  clearLogs: () => {
    logStore$.logs.set([]);
  },
});
