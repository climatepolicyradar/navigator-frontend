/* eslint-disable no-console */
import axios, { AxiosInstance, AxiosResponse } from "axios";

import { TCorpusTypeDictionary, TDataNode, TGeography, TLanguages } from "@/types";

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
      this.baseUrl = process.env.API_URL;
    }

    if (appToken) {
      this.appToken = appToken;
    } else {
      this.appToken = process.env.NEXT_PUBLIC_APP_TOKEN;
    }

    this.axiosClient = axios.create({
      baseURL: this.baseUrl,
      headers: { "app-token": this.appToken },
    });
  }

  /**
   * Submit a GET request and return the response as a mapped promise.
   */
  get<T = any>(url: string, params?: any): Promise<AxiosResponse<T>> {
    // console.log(`GET: ${this.baseUrl}${url}`);
    return this.axiosClient
      .get<T>(url, { params })
      .then((res: any) => res)
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  post<T>(url: string, values: any, config = {}) {
    // console.log(`POST: ${this.baseUrl}${url}`);
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
    // console.log(`PUT: ${this.baseUrl}${url}`);
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
      geographies: TDataNode<TGeography>[];
      corpus_types: TCorpusTypeDictionary;
      languages: TLanguages;
    }>("/config");
  }
}

export { ApiClient };
