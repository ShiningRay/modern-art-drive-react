/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { SERVER_URL } from '../constants'
import axios, { AxiosInstance } from 'axios'

export interface NftData {
  tokenId: string
  classId: string
  tid: number
  lock: {
    args: string
    codeHash: string
    hashType: string
  }
  characteristic: {
    rarity: number
  }
  address: string
  outPoint: {
    txHash: string
    index: string
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
    const url = `/renderer/${nft.characteristic.rarity}.png?tid=${nft.tid}`
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
