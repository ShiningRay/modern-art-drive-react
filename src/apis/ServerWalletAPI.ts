/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { SERVER_URL } from '../constants'
import axios, { AxiosInstance } from 'axios'

interface ApiData<T> {
  success: boolean
  data: T
}

export interface ProjectData {
  id: number
  key: string
  name: string
  name_en: string
  image: string
  article: string
}

export interface ResearchData {
  id: number
  title: string
  desc: string
  image: string
  link: string
}

export class ServerWalletAPI {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({ baseURL: SERVER_URL })
  }

  async getProjectDetail(name: string): Promise<ProjectData> {
    const url = `/api/v1/projects/${name}.json?_=${new Date().getTime()}`
    return await axios
      .get<ApiData<ProjectData>>(url)
      .then((resp) => resp.data.data)
  }

  async getResearchs(): Promise<ResearchData[]> {
    const url = `/api/v1/researchs.json?_=${new Date().getTime()}`
    return await axios
      .get<ApiData<ResearchData[]>>(url)
      .then((resp) => resp.data.data)
  }
}

const serverWalletAPI = new ServerWalletAPI()

export default serverWalletAPI
