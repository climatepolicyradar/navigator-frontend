/* eslint-disable no-console */
import axios, { AxiosInstance, AxiosResponse } from "axios";

import { TApiCorpusTypeDictionary, TApiDataNode, TApiGeography, TApiLanguages } from "@/types";

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
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  post<T>(url: string, values: any, config = {}) {
    return this.axiosClient
      .post<T>(url, values, config)
      .then((res) => res)
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error(error.response);
          return error.response;
        }
        console.error(error);
        return error;
      });
  }

  put(url: string, values: any) {
    return this.axiosClient
      .put(url, values)
      .then((res) => res)
      .catch((err) => {
        console.log(err);
        return Promise.reject(err);
      });
  }

  getConfig() {
    return this.get<{
      geographies: TApiDataNode<TApiGeography>[];
      corpus_types: TApiCorpusTypeDictionary;
      languages: TApiLanguages;
    }>("/config");
  }
}

export { ApiClient };
