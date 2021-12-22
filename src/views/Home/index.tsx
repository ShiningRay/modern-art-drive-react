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
import {
  PushpinOutlined,
  PlusSquareOutlined,
  RedoOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { sleep } from '../../utils'

interface NftComfirmModalProps extends CommonModalProps {
  data: NftData | null
  onOk: () => void
  text: string
  loading: boolean
}
interface NftAddWordModalProps extends CommonModalProps {
  data: NftData | null
  onOk: (words: NftWordData[]) => void
  loading: boolean
}

const NftComfirmModal: React.FC<NftComfirmModalProps> = ({
  data,
  onOk,
  text,
  loading,
  ...rest
}) => {
  if (!data) {
    return <></>
  }

  const handleOk = (): void => {
    if (!data) return
    onOk()
  }

  return (
    <CommonModal {...rest} className="nft-fix-modal">
      <div className="content">
        <div className="desc">{text}</div>
        <div className="opts">
          <button disabled={loading} onClick={handleOk}>
            {loading ? <LoadingOutlined /> : 'Yes'}
          </button>
          <button disabled={loading} className="cancel" onClick={rest.onClose}>
            {loading ? <LoadingOutlined /> : 'Cancel'}
          </button>
        </div>
      </div>
    </CommonModal>
  )
}

const zhReg = /^[\u4e00-\u9fa5]{0,5}$/
const enReg = /^[a-zA-Z]{0,10}$/
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
const NftAddWrodModal: React.FC<NftAddWordModalProps> = ({
  data,
  onOk,
  loading,
  ...rest
}) => {
  const [words, setWords] = useState<NftWordData[]>([])
  const [errors, setErrors] = useState<NftWordErr[]>([])

  useEffect(() => {
    if (rest.visible && data) {
      const defaultWords: NftWordData[] = []
      const defaultErrors: NftWordErr[] = []
      // switch (data.class.rarity) {
      //   case 'common':
      //     defaultWords.push(getDefaultWord())
      //     defaultErrors.push(getDefaultWordErr())
      //     break
      //   case 'rare':
      //     defaultWords.push(getDefaultWord())
      //     defaultWords.push(getDefaultWord())
      //     defaultErrors.push(getDefaultWordErr())
      //     defaultErrors.push(getDefaultWordErr())
      //     break
      //   case 'epic':
      //     defaultWords.push(getDefaultWord())
      //     defaultWords.push(getDefaultWord())
      //     defaultWords.push(getDefaultWord())
      //     defaultErrors.push(getDefaultWordErr())
      //     defaultErrors.push(getDefaultWordErr())
      //     defaultErrors.push(getDefaultWordErr())
      // }
      defaultWords.push(getDefaultWord())
      defaultErrors.push(getDefaultWordErr())
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

  const handleCheck = (): boolean => {
    let result = true
    words.forEach((word, i) => {
      const { en, zh } = word.content
      const err = errors[i]
      err.en = ''
      err.zh = ''
      if (!en) {
        err.en = "Can't be empty"
        result = false
      } else if (!enReg.test(en)) {
        err.en = 'only a-z, A-Z supported'
        result = false
      }
      if (!zh) {
        err.zh = "Can't be empty"
        result = false
      } else if (!zhReg.test(zh)) {
        err.zh = 'Only chinese supported'
        result = false
      }
    })
    setErrors([...errors])
    return result
  }

  const handleOk = (): void => {
    if (!data) return
    const result = handleCheck()
    if (!result) return
    onOk(words)
  }

  return (
    <CommonModal {...rest} title="Add words" className="nft-add-word-modal">
      <div className="content">
        {words.map((word, i) => (
          <div className="new-word" key={i}>
            <div className="title">
              <span>New Word</span>
              <select
                value={word.position}
                onChange={(e) =>
                  handleChangePosition(i, e.target.value as NftWordDataPosition)
                }
              >
                <option value="verb">Position 1</option>
                <option value="adjective">Position 2</option>
                <option value="noun">Position 3</option>
              </select>
            </div>
            <div className="inputs">
              <div
                className={classnames('input', { error: errors[i].en })}
                data-error={errors[i].en}
                onBlur={handleCheck}
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
                onBlur={handleCheck}
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
          <button disabled={loading} onClick={handleOk}>
            {loading ? <LoadingOutlined /> : 'Yes'}
          </button>
          <button disabled={loading} className="cancel" onClick={rest.onClose}>
            {loading ? <LoadingOutlined /> : 'Cancel'}
          </button>
        </div>
      </div>
    </CommonModal>
  )
}

interface NftCardProps {
  data: NftData
  onSelectCard?: (data: NftData) => void
}

const NftCard: React.FC<NftCardProps> = ({ data, onSelectCard }) => {
  const [loading, setLoading] = useState(true)
  const url = useMemo(() => serverWalletAPI.getImageUrl(data), [data])

  const handleLoad = (): void => {
    setLoading(false)
  }

  return (
    <div className="nft-card" onClick={() => onSelectCard?.(data)}>
      <div className="img">
        <img src={url} alt="" onLoad={handleLoad} />
        {loading && <div className="loading">Loading...</div>}
      </div>
      <div className="tid">
        <span>#{data.tid}</span>
      </div>
    </div>
  )
}

interface CurrentNftCardProps {
  data: NftData | null
  onFix: (data: NftData) => void
  onAddWord: (data: NftData) => void
  onRefresh: (data: NftData) => void
}

const CurrentNftCard: React.FC<CurrentNftCardProps> = ({
  data,
  onFix,
  onAddWord,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(true)
  const url = useMemo(
    () => (data ? serverWalletAPI.getImageUrl(data) : ''),
    [data]
  )

  const handleLoad = (): void => {
    setLoading(false)
  }

  if (!data) {
    return <div className="current-card" />
  }

  return (
    <div className="current-card">
      <div className="nft-card">
        <div className="img">
          <img src={url} alt="" onLoad={handleLoad} />
          {loading && <div className="loading">Loading...</div>}
        </div>
        <div className="tid">
          <span>#{data.tid}</span>
          <span>
            {!data.fixed && (
              <>
                <RedoOutlined onClick={() => onRefresh(data)} />
                <PushpinOutlined onClick={() => onFix(data)} />
              </>
            )}
            {!data.exercised && (
              <PlusSquareOutlined onClick={() => onAddWord(data)} />
            )}
          </span>
        </div>
      </div>
      <div className="opts">
        <div>
          <a onClick={() => onRefresh(data)}>
            <RedoOutlined />
            <span>刷新句子</span>
          </a>
        </div>
        <div>
          <a onClick={() => onFix(data)}>
            <PushpinOutlined />
            <span>收藏句子</span>
          </a>
        </div>
        {!data.exercised && (
          <div>
            <a onClick={() => onAddWord(data)}>
              <PlusSquareOutlined />
              <span>添加词汇</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export const Home: React.FC = () => {
  const [fixModalVisible, showFixModal] = useState(false)
  const [addWordModalVisible, showAddWordModal] = useState(false)
  const [refreshModalVisible, showRefreshModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [nfts, setNfts] = useState<NftData[]>([])
  const [data, setData] = useState<NftData | null>(null)
  const { address, sign, waitingSign, setWaitingSign, signTx } =
    Unipass.useContainer()

  const fixedNfts = useMemo(() => nfts.filter((nft) => nft.fixed), [nfts])
  const notFixedNfts = useMemo(() => nfts.filter((nft) => !nft.fixed), [nfts])

  useEffect(() => {
    if (!address) {
      setNfts([])
      setData(null)
      return
    }
    serverWalletAPI
      // .getNfts(
      //   'ckt1qqfy5cxd0x0pl09xvsvkmert8alsajm38qfnmjh2fzfu2804kq47vqfhs5m4f8d60hfuajnx3znz9egtd9yjh5qrw3yee'
      // )
      .getNfts(address)
      .then((data) => {
        setNfts(data)
        return data
      })
      .then(() => {
        if (waitingSign) {
          const label = waitingSign.args.label as string
          const args = waitingSign.args.args
          console.log('get unipass callback:')
          console.log(`  type: ${label}`)
          console.log('  args:')
          console.log(args)
          console.log('  unipass data:')
          console.log(waitingSign.data)

          if (label === 'fix') {
            return serverWalletAPI
              .fixNft(args[0], args[1], waitingSign.data.sig)
              .then(() => {
                message.success('fix success, update at 3s.')
                setWaitingSign(null)
              })
              .then(async () => {
                await sleep(3000)
                return await serverWalletAPI.getNfts(address)
              })
              .then(setNfts)
          } else if (label === 'addwords') {
            return serverWalletAPI
              .addWords(args[0], args[1], args[2], waitingSign.data.sig)
              .then(() => {
                message.success('add words success, update at 3s.')
                setWaitingSign(null)
              })
              .then(async () => {
                await sleep(3000)
                return await serverWalletAPI.getNfts(address)
              })
              .then(setNfts)
          } else if (label === 'refresh') {
            return serverWalletAPI
              .refreshNft(args[0], args[1], waitingSign.data.sig)
              .then(() => {
                message.success('refresh success, update at 3s.')
                setWaitingSign(null)
              })
              .then(async () => {
                await sleep(3000)
                return await serverWalletAPI.getNfts(address)
              })
              .then(setNfts)
          }
        }
      })
      .catch((e) => console.log(e))
  }, [address])

  const handleFix = (): void => {
    showFixModal(true)
  }

  const handleAddWord = (): void => {
    showAddWordModal(true)
  }

  const handleRefresh = (): void => {
    showRefreshModal(true)
  }

  const handleFixOk = async (): Promise<void> => {
    if (!data) return
    setSubmitting(true)
    const raw = await serverWalletAPI.getFixGen(
      data.class.rarity,
      data.tid.toString()
    )
    const signedMessage = await signTx(raw)
    console.log('签名Object：')
    console.log(raw)
    console.log('签名结果：')
    console.log(signedMessage)
    sign(signedMessage, 'fix', [data.class.rarity, data.tid.toString()]).catch(
      (e) => console.log(e)
    )
  }

  const handleRefreshOk = async (): Promise<void> => {
    if (!data) return
    setSubmitting(true)
    const raw = await serverWalletAPI.getRefreshGen(
      data.class.rarity,
      data.tid.toString()
    )
    const signedMessage = await signTx(raw)
    console.log('签名Object：')
    console.log(raw)
    console.log('签名结果：')
    console.log(signedMessage)
    sign(signedMessage, 'refresh', [
      data.class.rarity,
      data.tid.toString(),
    ]).catch((e) => console.log(e))
  }

  const handleAddWordOk = async (words: NftWordData[]): Promise<void> => {
    if (!data) return
    setSubmitting(true)
    const raw = await serverWalletAPI.getAddWordsGen(
      data.class.rarity,
      data.tid.toString(),
      words
    )
    const signedMessage = await signTx(raw)
    console.log('签名Object：')
    console.log(raw)
    console.log('签名结果：')
    console.log(signedMessage)
    sign(signedMessage, 'addwords', [
      data.class.rarity,
      data.tid.toString(),
      words,
    ]).catch((e) => console.log(e))
  }

  return (
    <>
      <div id="home">
        <div className="container">
          <CommonPageTitle title="我的驱动器" subTitle="My Driver" />
          {nfts.length === 0 && (
            <div className="empty">
              {address ? 'You have no nft yet' : 'Please connect wallet'}
            </div>
          )}
          <CommonPageTitle
            title="待行权NFT"
            subTitle="Nfts waiting for exercis"
            size="2"
          />
          <div className="not-fixed-driver">
            <CurrentNftCard
              data={data}
              onFix={handleFix}
              onAddWord={handleAddWord}
              onRefresh={handleRefresh}
            />
            <div className="cards">
              {notFixedNfts.map((nft, i) => (
                <NftCard data={nft} key={i} onSelectCard={setData} />
              ))}
            </div>
          </div>
          <CommonPageTitle title="收藏夹" subTitle="Favorites" size="2" />
          <div className="fixed-driver">
            {fixedNfts.map((nft, i) => (
              <NftCard data={nft} key={i} />
            ))}
          </div>
        </div>
      </div>
      <NftComfirmModal
        data={data}
        visible={fixModalVisible && !!data}
        onClose={() => showFixModal(false)}
        onOk={handleFixOk}
        text="Are you sure to fix this nft?"
        title={`Fix #${data ? data.tid : ''}`}
        loading={submitting}
      />
      <NftComfirmModal
        data={data}
        visible={refreshModalVisible && !!data}
        onClose={() => showRefreshModal(false)}
        onOk={handleRefreshOk}
        text="Are you sure to refresh this nft?"
        title={`Refresh #${data ? data.tid : ''}`}
        loading={submitting}
      />
      <NftAddWrodModal
        data={data}
        visible={addWordModalVisible && !!data}
        onClose={() => showAddWordModal(false)}
        onOk={handleAddWordOk}
        loading={submitting}
      />
    </>
  )
}
