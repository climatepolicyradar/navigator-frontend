import axios from "axios";
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { TApiConfig } from "@/types";

// Log a concise one-line summary of a failed request. Never log the full
// AxiosError/response: that dumps headers, the request body and the app-token
// JWT into the logs and buries the useful detail under Node internals.
function logApiError(error: AxiosError) {
  const method = error.config?.method?.toUpperCase() ?? "REQUEST";
  const url = error.config?.url ?? "unknown";
  const summary = error.response ? `${error.response.status} ${error.response.statusText}` : (error.code ?? error.message);
  console.error(`[api] ${method} ${url} -> ${summary}`);
}

export async function getEnvFromServer() {
  return await axios.get("/api/env").then((res: any) => res);
}

export async function getFilters() {
  return await axios.get("/api/theme-config").then((res: any) => res);
}

class ApiClient {
  private baseUrl: string;
  private appToken: string;
  private axiosClient: AxiosInstance;

  constructor(baseUrl = "", appToken = "") {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      this.baseUrl = process.env.BACKEND_API_URL;
    }

    if (appToken) {
      this.appToken = appToken;
    } else {
      this.appToken = process.env.BACKEND_API_TOKEN;
    }

    // In Axios, empty or undefined headers throw errors.
    const headers: Record<string, string> = {};
    if (this.appToken) {
      headers["app-token"] = this.appToken;
    }

    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      headers,
    });
  }

  /**
   * Submit a GET request and return the response as a mapped promise.
   */
  get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.axiosClient
      .get<T>(url, { params })
      .then((res: any) => res)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          logApiError(error);
          return error.response;
        }
        console.error(error);
        throw error;
      });
  }

  post<T>(url: string, values: any, config = {}) {
    return this.axiosClient
      .post<T>(url, values, config)
      .then((res) => res)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          logApiError(error);
          return error.response;
        }
        console.error(error);
        return error;
      });
  }

  async getConfig(): Promise<{ config: TApiConfig; error: Error | null }> {
    try {
      const config = await this.get<TApiConfig>("/config");
      return { config: config.data, error: null };
    } catch (error) {
      return {
        config: {
          geographies: [],
          corpus_types: {},
          languages: {},
        },
        error: error as Error,
      };
    }
  }
}

export { ApiClient };
