import { AxiosError, type AxiosAdapter } from "axios";
import { handleAuth } from "./auth-handlers";
import { scenarios } from "./scenarios";
export const fakeAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, scenarios.delay));
  if (config.signal?.aborted)
    throw new AxiosError("Request cancelled", "ERR_CANCELED", config);
  const body =
    typeof config.data === "string"
      ? JSON.parse(config.data)
      : (config.data ?? {});
  const result = scenarios.serverError
    ? { status: 500, data: { message: "Сервис временно недоступен." } }
    : handleAuth(config.method ?? "get", config.url ?? "", body);
  const response = {
    ...result,
    statusText: String(result.status),
    headers: {},
    config,
  };
  if (result.status >= 400)
    throw new AxiosError(
      "API error",
      "ERR_BAD_RESPONSE",
      config,
      undefined,
      response,
    );
  return response;
};
