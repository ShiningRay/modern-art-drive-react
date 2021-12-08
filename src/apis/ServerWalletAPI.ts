/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { SERVER_URL } from '../constants'
import axios, { AxiosInstance } from 'axios'

export type NftDataRarity = 'common' | 'rare' | 'epic'

export type NftWordDataPosition = 'noun' | 'verb' | 'adjective'

export interface NftWordData {
  position: NftWordDataPosition
  content: {
    en: string
    zh: string
  }
}

export interface NftData {
  tokenClassId: number
  tid: number
  holder: string
  fixed: boolean
  fixedAt?: string
  fixedAtBlock?: number
  class: {
    color: string
    id: number
    rarity: NftDataRarity
    typeArgs: string
  }
  sentence: NftWordData
  exercised: boolean
  exercisedAt?: string
  exercisedAtBlock?: number
  refreshedAt?: string
  refreshedAtBlock?: number
}

export interface RecnetFixData {
  tid: number
  sentence: {
    en: string
    zh: string
  }
}

export class ServerWalletAPI {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({ baseURL: SERVER_URL })
  }

  async getNfts(address: string): Promise<NftData[]> {
    const url = `/nfts/${address}`
    return await axios.get<NftData[]>(url).then((resp) => resp.data)
  }

  getImageUrl(nft: NftData): string {
    const url = `/renderer/${nft.class.rarity}.png?tid=${nft.tid}&_=${nft.refreshedAtBlock}`
    return url
  }

  async fixNft(
    rarity: string | number,
    tid: string | number,
    sig: string
  ): Promise<any> {
    const url = `/fix/${rarity}/${tid}`
    return await axios.post<any>(url, { sig }).then((resp) => resp.data)
  }

  async addWords(
    rarity: string | number,
    tid: string | number,
    words: NftWordData[],
    sig: string
  ): Promise<any> {
    const url = `/add/${rarity}/${tid}`
    return await axios.post<any>(url, { words, sig }).then((resp) => resp.data)
  }

  async getRecnetFix(): Promise<RecnetFixData[]> {
    const url = '/fix/recent'
    return await axios.get(url).then((resp) => resp.data)
  }

  async refreshNft(
    rarity: string | number,
    tid: string | number,
    sig: string
  ): Promise<any> {
    const url = `/refresh/${rarity}/${tid}`
    return await axios.post<any>(url, { sig }).then((resp) => resp.data)
  }
}

const serverWalletAPI = new ServerWalletAPI()

export default serverWalletAPI
