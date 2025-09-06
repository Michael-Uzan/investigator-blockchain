import { logStore$ } from "./logStore";

describe("logStore$", () => {
  beforeEach(() => {
    logStore$.clearLogs();
  });

  it("starts with no logs", () => {
    expect(logStore$.logs.get()).toEqual([]);
    expect(logStore$.logCount()).toBe(0);
  });

  it("adds a log", () => {
    const log = { url: "/api/test", state: "loading" as const };
    logStore$.addLog(log);

    const logs = logStore$.logs.get();
    expect(logs.length).toBe(1);
    expect(logs[0]).toEqual(log);
    expect(logStore$.logCount()).toBe(1);
  });

  it("adds logs to the beginning (newest first)", () => {
    const log1 = { url: "/api/1", state: "success" as const };
    const log2 = { url: "/api/2", state: "error" as const, error: "Oops" };

    logStore$.addLog(log1);
    logStore$.addLog(log2);

    const logs = logStore$.logs.get();
    expect(logs[0]).toEqual(log2);
    expect(logs[1]).toEqual(log1);
  });

  it("keeps only the most recent 200 logs", () => {
    for (let i = 0; i < 205; i++) {
      logStore$.addLog({ url: `/api/${i}`, state: "success" });
    }

    const logs = logStore$.logs.get();
    expect(logs.length).toBe(200);
    expect(logs[0].url).toBe("/api/204"); // newest
    expect(logs[199].url).toBe("/api/5"); // oldest kept
  });

  it("clears logs", () => {
    logStore$.addLog({ url: "/api/test", state: "success" });
    expect(logStore$.logCount()).toBe(1);

    logStore$.clearLogs();
    expect(logStore$.logs.get()).toEqual([]);
    expect(logStore$.logCount()).toBe(0);
  });
});
