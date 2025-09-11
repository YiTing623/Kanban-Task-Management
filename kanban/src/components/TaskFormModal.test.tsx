import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskFormModal from "../components/TaskFormModal";

describe("TaskFormModal a11y & submit", () => {
  it("has dialog semantics and Esc closes", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<TaskFormModal open initial={{}} onClose={onClose} onSubmit={() => {}} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("submits normalized values (tags array, ISO dueDate)", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TaskFormModal open initial={{}} onClose={() => {}} onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Title"), "Ship");
    await user.type(screen.getByPlaceholderText("Description"), "Do it");
    await user.type(screen.getByPlaceholderText("Assignee"), "Alex");
    await user.selectOptions(screen.getByLabelText(/Status/i), "in-progress");
    await user.selectOptions(screen.getByLabelText(/Priority/i), "high");
    await user.type(screen.getByPlaceholderText("Tags (comma separated)"), "alpha, beta");
    await user.clear(screen.getByLabelText(/Due date/i));
    await user.type(screen.getByLabelText(/Due date/i), "2024-01-20");

    await user.click(screen.getByRole("button", { name: /save/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload).toMatchObject({
      title: "Ship",
      description: "Do it",
      assignee: "Alex",
      status: "in-progress",
      priority: "high",
      tags: ["alpha", "beta"],
    });
    expect(payload.dueDate).toMatch(/^2024-01-20T00:00:00.000Z$/);
  });
});
