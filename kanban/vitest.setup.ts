import "@testing-library/jest-dom/vitest";

if (!(globalThis.crypto as any)?.randomUUID) {
  (globalThis as any).crypto = {
    ...(globalThis.crypto || {}),
    randomUUID: () =>
      Math.random().toString(36).slice(2) + Date.now().toString(36),
  };
}

class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() { this.store = {}; }
  getItem(k: string) { return Object.prototype.hasOwnProperty.call(this.store, k) ? this.store[k] : null; }
  setItem(k: string, v: string) { this.store[k] = String(v); }
  removeItem(k: string) { delete this.store[k]; }
}
Object.defineProperty(window, "localStorage", { value: new LocalStorageMock() });
