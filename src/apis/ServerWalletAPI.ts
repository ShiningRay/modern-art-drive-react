/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { SERVER_URL } from '../constants'
import axios, { AxiosInstance } from 'axios'

export type NftDataRarity = 'common' | 'rare' | 'epic'

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
  exercised: boolean
  exercisedAt?: string
  exercisedAtBlock?: number
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
    const url = `/renderer/${nft.class.rarity}.png?tid=${nft.tid}`
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
}

const serverWalletAPI = new ServerWalletAPI()

export default serverWalletAPI
