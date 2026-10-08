import { beforeEach, describe, expect, it, vi } from "vitest";
import { client } from "../client";
import { resetDemo } from "./auth-handlers";
import { scenarios } from "./scenarios";
beforeEach(() => {
  localStorage.clear();
  resetDemo();
  scenarios.delay = 0;
  scenarios.serverError = false;
});
describe("fake auth API", () => {
  it("rejects invalid credentials, creates a session and revokes it on logout", async () => {
    await expect(
      client.post("/auth/login", {
        email: "admin@example.com",
        password: "wrong",
      }),
    ).rejects.toMatchObject({ response: { status: 401 } });
    await client.post("/auth/login", {
      email: "admin@example.com",
      password: "Demo12345!",
    });
    expect((await client.get("/auth/me")).data.email).toBe("admin@example.com");
    await client.post("/auth/logout");
    await expect(client.get("/auth/me")).rejects.toMatchObject({
      response: { status: 401 },
    });
  });
  it("resets password, revokes session, rejects old password and reused token", async () => {
    await client.post("/auth/login", {
      email: "admin@example.com",
      password: "Demo12345!",
    });
    const { data } = await client.post("/auth/forgot-password", {
      email: "admin@example.com",
    });
    const token = new URL(data.demoLink, "http://localhost").searchParams.get(
      "token",
    );
    await client.post("/auth/reset-password", {
      token,
      password: "NewPassword123",
    });
    await expect(client.get("/auth/me")).rejects.toBeDefined();
    await expect(
      client.post("/auth/login", {
        email: "admin@example.com",
        password: "Demo12345!",
      }),
    ).rejects.toBeDefined();
    await client.post("/auth/login", {
      email: "admin@example.com",
      password: "NewPassword123",
    });
    await expect(
      client.post("/auth/reset-password", { token, password: "Another123" }),
    ).rejects.toBeDefined();
  });
  it("keeps the response uniform for unknown email and rejects invalid tokens", async () => {
    const known = (
      await client.post("/auth/forgot-password", { email: "admin@example.com" })
    ).data;
    const unknown = (
      await client.post("/auth/forgot-password", {
        email: "unknown@example.com",
      })
    ).data;
    expect(unknown.message).toBe(known.message);
    await expect(
      client.post("/auth/reset-password", {
        token: "invalid",
        password: "NewPassword123",
      }),
    ).rejects.toMatchObject({ response: { status: 400 } });
  });
  it("rejects expired reset tokens and weak passwords", async () => {
    const { data } = await client.post("/auth/forgot-password", {
      email: "admin@example.com",
    });
    const token = new URL(data.demoLink, "http://localhost").searchParams.get(
      "token",
    );
    await expect(
      client.post("/auth/reset-password", { token, password: "short" }),
    ).rejects.toMatchObject({ response: { status: 422 } });
    const now = Date.now();
    const clock = vi.spyOn(Date, "now").mockReturnValue(now + 16 * 60 * 1000);
    try {
      await expect(
        client.post("/auth/reset-password", {
          token,
          password: "NewPassword123",
        }),
      ).rejects.toMatchObject({ response: { status: 400 } });
    } finally {
      clock.mockRestore();
    }
  });
  it("rejects expired sessions and propagates server errors", async () => {
    localStorage.setItem(
      "access.demo-session",
      JSON.stringify({ expiresAt: 0 }),
    );
    await expect(client.get("/auth/me")).rejects.toMatchObject({
      response: { status: 401 },
    });
    scenarios.serverError = true;
    await expect(client.get("/auth/me")).rejects.toMatchObject({
      response: { status: 500 },
    });
  });
});
