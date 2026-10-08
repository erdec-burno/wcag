import axios from "axios";
export function errorMessage(error: unknown) {
  return axios.isAxiosError(error)
    ? (error.response?.data?.message ??
        "Не удалось выполнить запрос. Попробуйте снова.")
    : "Произошла ошибка. Попробуйте снова.";
}
