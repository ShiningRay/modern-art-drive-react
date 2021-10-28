import React, { useEffect, useMemo, useState } from 'react'
import CommonPageTitle from '../../components/CommonPageTitle'
import Unipass from '../../store/unipass'
import serverWalletAPI, { NftData } from '../../apis/ServerWalletAPI'
import './style.scss'

const NftCard: React.FC<NftData> = (data) => {
  const [loading, setLoading] = useState(true)
  const url = useMemo(() => serverWalletAPI.getImageUrl(data), [data])

  const handleLoad = (): void => {
    setLoading(false)
  }

  return (
    <div className="nft-card">
      <div className="img">
        <img src={url} alt="" onLoad={handleLoad} />
        {loading && <div className="loading">Loading...</div>}
      </div>
      <div className="tid">#{data.tid}</div>
    </div>
  )
}

export const Home: React.FC = () => {
  const [nfts, setNfts] = useState<NftData[]>([])
  const { address } = Unipass.useContainer()

  useEffect(() => {
    if (!address) return
    serverWalletAPI
      // .getNfts(
      //   'ckb1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqggv83tqz8vpu43u6zklw9zgxvzytsz7xgnzqksz'
      // )
      .getNfts(address)
      .then(setNfts)
      .catch((e) => console.log(e))
  }, [address])

  return (
    <div id="home">
      <div className="container">
        <CommonPageTitle lines={['My Nfts']} />
        <div className="cards">
          {nfts.map((nft) => (
            <NftCard {...nft} key={nft.tid} />
          ))}
        </div>
        {nfts.length === 0 && (
          <div className="empty">
            {address ? 'You have no nft yet' : 'Please connect wallet'}
          </div>
        )}
      </div>
    </div>
  )
}
