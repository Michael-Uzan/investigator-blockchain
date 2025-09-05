import { observable } from "@legendapp/state";
import type { ApiLog } from "../types";

export const logStore$ = observable({
  logs: [] as ApiLog[],

  // Computed helpers
  logCount: () => logStore$.logs.get().length,

  // Actions
  addLog: (log: ApiLog) => {
    const logs = logStore$.logs.get();
    logStore$.logs.set([log, ...logs].slice(0, 200));
  },

  clearLogs: () => {
    logStore$.logs.set([]);
  },
});
