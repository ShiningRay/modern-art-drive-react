import React, { useEffect, useMemo, useState } from 'react'
import CommonPageTitle from '../../components/CommonPageTitle'
import Unipass from '../../store/unipass'
import classnames from 'classnames'
import serverWalletAPI, {
  NftData,
  NftWordData,
  NftWordDataPosition,
} from '../../apis/ServerWalletAPI'
import CommonModal, { CommonModalProps } from '../../components/CommonModal'
import message from '../../components/CommonMessage'
import './style.scss'
import { PushpinOutlined, PlusSquareOutlined } from '@ant-design/icons'

interface NftFixModalProps extends CommonModalProps {
  data: NftData | null
  onOk: (data: NftData) => void
}

const NftFixModal: React.FC<NftFixModalProps> = ({ data, onOk, ...rest }) => {
  if (!data) {
    return <></>
  }

  const { tid } = data

  const handleOk = (): void => {
    if (!data) return
    onOk(data)
  }

  return (
    <CommonModal {...rest} title={`Fix #${tid}`} className="nft-fix-modal">
      <div className="content">
        <div className="desc">Are you sure to fix this nft?</div>
        <div className="opts">
          <button onClick={handleOk}>Yes</button>
          <button className="cancel" onClick={rest.onClose}>
            Cancel
          </button>
        </div>
      </div>
    </CommonModal>
  )
}

// const zhReg = /^[\u4e00-\u9fa5]{0,5}$/
// const enReg = /^[a-zA-Z]{0,10}$/
function getDefaultWord(): NftWordData {
  return {
    position: 'noun',
    content: {
      en: '',
      zh: '',
    },
  }
}
function getDefaultWordErr(): NftWordErr {
  return {
    en: '',
    zh: '',
  }
}
interface NftWordErr {
  en: string
  zh: string
}
const NftAddWrodModal: React.FC<NftFixModalProps> = ({
  data,
  onOk,
  ...rest
}) => {
  const [words, setWords] = useState<NftWordData[]>([])
  const [errors, setErrors] = useState<NftWordErr[]>([])

  useEffect(() => {
    if (rest.visible && data) {
      const defaultWords: NftWordData[] = []
      const defaultErrors: NftWordErr[] = []
      if (data.class.rarity === 'common') {
        defaultWords.push(getDefaultWord())
        defaultErrors.push(getDefaultWordErr())
      } else if (data.class.rarity === 'rare') {
        defaultWords.push(getDefaultWord())
        defaultWords.push(getDefaultWord())
        defaultErrors.push(getDefaultWordErr())
        defaultErrors.push(getDefaultWordErr())
      } else if (data.class.rarity === 'epic') {
        defaultWords.push(getDefaultWord())
        defaultWords.push(getDefaultWord())
        defaultWords.push(getDefaultWord())
        defaultErrors.push(getDefaultWordErr())
        defaultErrors.push(getDefaultWordErr())
        defaultErrors.push(getDefaultWordErr())
      }
      setWords(defaultWords)
      setErrors(defaultErrors)
    }
  }, [rest.visible])

  if (!data) {
    return <></>
  }

  const handleChangePosition = (
    index: number,
    value: NftWordDataPosition
  ): void => {
    const word = words[index]
    word.position = value
    setWords([...words])
  }

  const handleChangeEn = (index: number, value: string): void => {
    const word = words[index]
    word.content.en = value
    setWords([...words])
  }

  const handleChangeZh = (index: number, value: string): void => {
    const word = words[index]
    word.content.zh = value
    setWords([...words])
  }

  const handleOk = (): void => {
    if (!data) return
    // TODO: check
    onOk(data)
  }

  return (
    <CommonModal {...rest} title="Add words" className="nft-add-word-modal">
      <div className="content">
        {words.map((word, i) => (
          <div className="new-word" key={i}>
            <div className="title">
              <span>New Word {i + 1}</span>
              <select
                value={word.position}
                onChange={(e) =>
                  handleChangePosition(i, e.target.value as NftWordDataPosition)
                }
              >
                <option value="noun">noun.</option>
                <option value="verb">verb.</option>
                <option value="adjective">adjective.</option>
              </select>
            </div>
            <div className="inputs">
              <div
                className={classnames('input', { error: errors[i].en })}
                data-error={errors[i].en}
              >
                <span>EN</span>
                <input
                  type="text"
                  value={word.content.en}
                  onChange={(e) => handleChangeEn(i, e.target.value)}
                />
              </div>
              <div
                className={classnames('input', { error: errors[i].zh })}
                data-error={errors[i].zh}
              >
                <span>CN</span>
                <input
                  type="text"
                  value={word.content.zh}
                  onChange={(e) => handleChangeZh(i, e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="opts">
          <button onClick={handleOk}>Yes</button>
          <button className="cancel" onClick={rest.onClose}>
            Cancel
          </button>
        </div>
      </div>
    </CommonModal>
  )
}

interface NftCardProps {
  data: NftData
  onFix: (data: NftData) => void
  onAddWord: (data: NftData) => void
}

const NftCard: React.FC<NftCardProps> = ({ data, onFix, onAddWord }) => {
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
      <div className="tid">
        <span>#{data.tid}</span>
        <span>
          {!data.fixed && <PushpinOutlined onClick={() => onFix(data)} />}
          {!data.exercised && (
            <PlusSquareOutlined onClick={() => onAddWord(data)} />
          )}
        </span>
      </div>
    </div>
  )
}

export const Home: React.FC = () => {
  const [fixModalVisible, showFixModal] = useState(false)
  const [addWordModalVisible, showAddWordModal] = useState(false)
  const [nfts, setNfts] = useState<NftData[]>([])
  const [data, setData] = useState<NftData | null>(null)
  const { address, sign, waitingSign, setWaitingSign } = Unipass.useContainer()

  useEffect(() => {
    if (!address) {
      setNfts([])
      setData(null)
      return
    }
    serverWalletAPI
      .getNfts(
        'ckt1qqfy5cxd0x0pl09xvsvkmert8alsajm38qfnmjh2fzfu2804kq47vqfhs5m4f8d60hfuajnx3znz9egtd9yjh5qrw3yee'
      )
      // .getNfts(address)
      .then((data) => {
        setNfts(data)
        return data
      })
      .then(() => {
        if (waitingSign) {
          return serverWalletAPI
            .fixNft(
              waitingSign.args[0],
              waitingSign.args[1],
              waitingSign.data.sig
            )
            .then(() => {
              message.success('fix success')
              setWaitingSign(null)
            })
        }
      })
      .catch((e) => console.log(e))
  }, [address])

  const handleFix = (data: NftData): void => {
    setData(data)
    showFixModal(true)
  }

  const handleAddWord = (data: NftData): void => {
    setData(data)
    showAddWordModal(true)
  }

  const handleFixOk = (data: NftData): void => {
    const message = `Fix ${data.class.rarity} #${data.tid}`
    sign(message, [data.class.rarity, data.tid.toString()]).catch((e) =>
      console.log(e)
    )
  }

  return (
    <>
      <div id="home">
        <div className="container">
          <CommonPageTitle lines={['My Nfts']} />
          <div className="cards">
            {nfts.map((nft, i) => (
              <NftCard
                data={nft}
                key={i}
                onFix={handleFix}
                onAddWord={handleAddWord}
              />
            ))}
          </div>
          {nfts.length === 0 && (
            <div className="empty">
              {address ? 'You have no nft yet' : 'Please connect wallet'}
            </div>
          )}
        </div>
      </div>
      <NftFixModal
        data={data}
        visible={fixModalVisible && !!data}
        onClose={() => showFixModal(false)}
        onOk={handleFixOk}
      />
      <NftAddWrodModal
        data={data}
        visible={addWordModalVisible && !!data}
        onClose={() => showAddWordModal(false)}
        onOk={handleFixOk}
      />
    </>
  )
}
