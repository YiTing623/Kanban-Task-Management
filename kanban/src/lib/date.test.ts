import { describe, it, expect } from "vitest";
import { formatDate, isOverdue } from "./date";

describe("date utils", () => {
  it("formats ISO deterministically", () => {
    expect(formatDate("2024-01-05T00:00:00Z")).toBe("2024-01-05");
  });
  it("detects overdue", () => {
    expect(isOverdue("1970-01-02T00:00:00Z")).toBe(true);
  });
});
