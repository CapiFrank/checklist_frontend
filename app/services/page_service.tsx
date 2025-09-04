import type { Api } from "~/types/api";
import { request } from "./http_client";
import type { Page } from "~/types/page";

export const pageService = {
  getPages: () => request<Api>("/pages"),
  createPage: (page: Page) =>
    request<Api>("/pages", { method: "POST", body: JSON.stringify(page) }),
  updatePage: (page: Page) =>
    request<Api>(`/pages`, { method: "PUT", body: JSON.stringify(page) }),
  deletePage: (page: Page) =>
    request<Api>(`/pages`, { method: "DELETE", body: JSON.stringify(page) }),
};
