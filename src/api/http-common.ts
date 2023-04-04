import axios, { AxiosInstance, AxiosResponse } from "axios";

export async function getEnvFromServer() {
  return await axios.get("/api/env").then((res: any) => res);
}

class ApiClient {
  private baseUrl: string;
  private axiosClient: AxiosInstance;

  constructor(baseUrl = "") {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      this.baseUrl = process.env.API_URL;
    }
    this.axiosClient = axios.create({ baseURL: this.baseUrl, headers: { "Cache-control": "public, max-age=3600, immutable" } });
  }

  /**
   * Submit a GET request and return the response as a mapped promise.
   */
  get(url: string, params?: any): Promise<AxiosResponse> {
    // console.log(`GET: ${this.baseUrl}${url}`);
    return this.axiosClient
      .get(`${url}?group_documents=true`, { params })
      .then((res: any) => res)
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  post<T>(url: string, values: any, config = {}) {
    // console.log(`POST: ${this.baseUrl}${url}`);
    return this.axiosClient
      .post<T>(`${url}?group_documents=true`, values, config)
      .then((res) => res)
      .catch((err) => {
        console.log(err);
        return err;
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
}

export { ApiClient };
