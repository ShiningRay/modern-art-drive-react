import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import CommonPageTitle from '../../components/CommonPageTitle'
import Unipass from '../../store/unipass'
import classnames from 'classnames'
import Slider from 'react-slick'
import useDetectMobile from '../../hooks/useDetectMobile'
import serverWalletAPI, {
  NftData,
  NftWordData,
  NftWordDataPosition,
} from '../../apis/ServerWalletAPI'
import CommonModal, { CommonModalProps } from '../../components/CommonModal'
import './style.scss'
import {
  PushpinOutlined,
  PlusSquareOutlined,
  RedoOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import okImg from '../../assets/img/btn-ok.svg'
import cancelImg from '../../assets/img/btn-cancel.svg'
import { useLocation } from 'react-router'
import qs from 'qs'
import System from '../../store/system'

interface NftImageModalProps extends CommonModalProps {
  data: NftData | null
}

const NftImageModal: React.FC<NftImageModalProps> = ({ data, ...rest }) => {
  const url = useMemo(
    () => (data ? serverWalletAPI.getImageUrl(data, 'normal') : undefined),
    [data]
  )

  return (
    <CommonModal {...rest} className="nft-image-modal">
      <div className="content">
        <div className="desc">{url && <img src={url} alt="" />}</div>
      </div>
    </CommonModal>
  )
}

interface NftComfirmModalProps extends CommonModalProps {
  data: NftData | null
  onOk: () => void
  text: string | ReactElement
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
            {loading ? <LoadingOutlined /> : <img src={okImg} alt="" />}
          </button>
          <button disabled={loading} className="cancel" onClick={rest.onClose}>
            {loading ? <LoadingOutlined /> : <img src={cancelImg} alt="" />}
          </button>
        </div>
      </div>
    </CommonModal>
  )
}

const zhReg = /^[\u4e00-\u9fa5]{0,5}$/
// const enReg = /^[a-zA-Z]{0,15}$/
function getDefaultWord(): NftWordData {
  return {
    position: 'verb',
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

  // const handleChangeEn = (index: number, value: string): void => {
  //   const word = words[index]
  //   word.content.en = value
  //   setWords([...words])
  // }

  const handleChangeZh = (index: number, value: string): void => {
    const word = words[index]
    word.content.zh = value
    setWords([...words])
  }

  const handleCheck = (): boolean => {
    let result = true
    words.forEach((word, i) => {
      const { zh } = word.content
      const err = errors[i]
      err.en = ''
      err.zh = ''
      // if (!en) {
      //   err.en = "Can't be empty"
      //   result = false
      // } else if (!enReg.test(en)) {
      //   err.en = 'only a-z, A-Z supported'
      //   result = false
      // }
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
    <CommonModal
      {...rest}
      title={<CommonPageTitle title="添加词汇" subTitle="Add word" size="3" />}
      className="nft-add-word-modal"
    >
      <div className="content">
        {words.map((word, i) => (
          <div className="new-word" key={i}>
            <div className="radio">
              <div
                className={classnames({ active: word.position === 'verb' })}
                onClick={() => handleChangePosition(i, 'verb')}
              >
                <span>
                  <span>添加排头词（动词）</span>
                  <span>Front Word(verb.)</span>
                </span>
              </div>
              <div
                className={classnames({
                  active: word.position === 'adjective',
                })}
                onClick={() => handleChangePosition(i, 'adjective')}
              >
                <span>
                  <span>添加中间词（形容词）</span>
                  <span>Middle Word(adj.)</span>
                </span>
              </div>
              <div
                className={classnames({ active: word.position === 'noun' })}
                onClick={() => handleChangePosition(i, 'noun')}
              >
                <span>
                  <span>添加结尾词（名词）</span>
                  <span>Last Word(noun.)</span>
                </span>
              </div>
            </div>
            <div className="inputs">
              <div
                className={classnames('input', { error: errors[i].zh })}
                data-error={errors[i].zh}
                onBlur={handleCheck}
              >
                <span>新词条</span>
                <input
                  type="text"
                  value={word.content.zh}
                  onChange={(e) => handleChangeZh(i, e.target.value)}
                />
              </div>
              {/* <div
                className={classnames('input', { error: errors[i].en })}
                data-error={errors[i].en}
                onBlur={handleCheck}
              >
                <span>英文（EN）</span>
                <input
                  type="text"
                  value={word.content.en}
                  onChange={(e) => handleChangeEn(i, e.target.value)}
                />
              </div> */}
            </div>
          </div>
        ))}
        <div className="opts">
          <button disabled={loading} onClick={handleOk}>
            {loading ? <LoadingOutlined /> : <img src={okImg} alt="" />}
          </button>
          <button disabled={loading} className="cancel" onClick={rest.onClose}>
            {loading ? <LoadingOutlined /> : <img src={cancelImg} alt="" />}
          </button>
        </div>
      </div>
    </CommonModal>
  )
}

interface NftCardProps {
  data: NftData
  onSelectCard?: (data: NftData) => void
  size?: 'normal' | 'small'
  active?: boolean
  onShowImage?: (data: NftData) => void
}

const NftCard: React.FC<NftCardProps> = ({
  data,
  onSelectCard,
  size = 'normal',
  active = false,
  onShowImage,
}) => {
  const [loading, setLoading] = useState(true)
  const url = useMemo(
    () => serverWalletAPI.getImageUrl(data, size),
    [data, size]
  )

  const handleLoad = (): void => {
    setLoading(false)
  }

  return (
    <div
      className={classnames('nft-card', { active })}
      onClick={() => onSelectCard?.(data)}
    >
      <div className="img">
        <img
          onClick={onShowImage ? () => onShowImage(data) : undefined}
          src={url}
          alt=""
          onLoad={handleLoad}
        />
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
  onShowImage: (data: NftData) => void
}

const CurrentNftCard: React.FC<CurrentNftCardProps> = ({
  data,
  onFix,
  onAddWord,
  onRefresh,
  onShowImage,
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
          <img
            onClick={() => onShowImage(data)}
            src={url}
            alt=""
            onLoad={handleLoad}
          />
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
        {!data.fixed && (
          <>
            <div>
              <a onClick={() => onRefresh(data)}>
                <RedoOutlined />
                <span>
                  <span>刷新句子</span>
                  <span>Refresh</span>
                </span>
              </a>
            </div>
            <div>
              <a onClick={() => onFix(data)}>
                <PushpinOutlined />
                <span>
                  <span>保留句子</span>
                  <span>Fix the phrase</span>
                </span>
              </a>
            </div>
          </>
        )}
        {!data.exercised && (
          <div>
            <a onClick={() => onAddWord(data)}>
              <PlusSquareOutlined />
              <span>
                <span>添加词汇</span>
                <span>Add words</span>
              </span>
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
  const [imgModalVisible, showImageModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [nfts, setNfts] = useState<NftData[]>([])
  const [data, setData] = useState<NftData | null>(null)
  const [currentShowData, setCurrentShowData] = useState<NftData | null>(null)
  const { address, sign, signTx } = Unipass.useContainer()
  const { alertMessage } = System.useContainer()
  const [isMobile] = useDetectMobile()
  const location = useLocation()

  const fixedNfts = useMemo(
    () => nfts.filter((nft) => nft.fixed && nft.exercised),
    [nfts]
  )
  const notFixedNfts = useMemo(
    () => nfts.filter((nft) => !fixedNfts.includes(nft)),
    [nfts, fixedNfts]
  )

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
      .then(setNfts)
      .catch((e) => console.log(e))
  }, [address])

  useEffect(() => {
    if (notFixedNfts.length > 0) {
      const search = location.search.slice(1)
      const querys = qs.parse(search)
      if (querys.rarity && querys.tid) {
        const selectedNft = notFixedNfts.find(
          (nft) =>
            nft.class.rarity === querys.rarity &&
            nft.tid === parseInt(querys.tid as string)
        )
        if (selectedNft) {
          setData(selectedNft)
          return
        }
      }
      setData(notFixedNfts[0])
    }
  }, [notFixedNfts])

  const handleFix = (): void => {
    showFixModal(true)
  }

  const handleAddWord = (): void => {
    showAddWordModal(true)
  }

  const handleRefresh = (): void => {
    showRefreshModal(true)
  }

  const handleImageShow = (data: NftData): void => {
    setCurrentShowData(data)
    showImageModal(true)
  }

  const handleGenError = (error: any): void => {
    if (error.response?.data?.message) {
      alertMessage(
        error.response.data.message
          .split('\n')
          .map((line: string) => <div>{line}</div>),
        {
          okButton: true,
          type: 'error',
        }
      )
    }
  }

  const handleFixOk = async (): Promise<void> => {
    if (!data) return
    setSubmitting(true)
    try {
      const raw = await serverWalletAPI.getFixGen(
        data.class.rarity,
        data.tid.toString()
      )
      const signedMessage = await signTx(raw)
      console.log('签名Object：')
      console.log(raw)
      console.log('签名结果：')
      console.log(signedMessage)
      sign(signedMessage, 'fix', [
        data.class.rarity,
        data.tid.toString(),
      ]).catch((e) => console.log(e))
    } catch (error) {
      handleGenError(error)
      setSubmitting(false)
      showFixModal(false)
    }
  }

  const handleRefreshOk = async (): Promise<void> => {
    if (!data) return
    setSubmitting(true)
    try {
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
    } catch (error: any) {
      handleGenError(error)
      setSubmitting(false)
      showRefreshModal(false)
    }
  }

  const handleAddWordOk = async (words: NftWordData[]): Promise<void> => {
    if (!data) return
    setSubmitting(true)
    try {
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
    } catch (error) {
      handleGenError(error)
      setSubmitting(false)
      showAddWordModal(false)
    }
  }

  const slideSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 0,
    slidesToShow: 3,
    autoplay: false,
  }

  return (
    <>
      <div id="home">
        <div className="container">
          <CommonPageTitle
            title="我的驱动器"
            subTitle="My Driver"
            extra={<button className="page-title-button">操作教程</button>}
          />
          {nfts.length === 0 && (
            <div className="empty">
              {address ? 'You have no nft yet' : 'Please connect wallet'}
            </div>
          )}
          {notFixedNfts.length > 0 && (
            <>
              <CommonPageTitle
                title="待行权NFT"
                subTitle="NFTs ABLE TO OPERATE"
                size="2"
              />
              <div className="not-fixed-driver">
                <CurrentNftCard
                  data={data}
                  onFix={handleFix}
                  onAddWord={handleAddWord}
                  onRefresh={handleRefresh}
                  onShowImage={handleImageShow}
                />
                {isMobile ? (
                  <Slider {...slideSettings} className="cards-slide">
                    {notFixedNfts.map((nft, i) => (
                      <NftCard
                        data={nft}
                        key={i}
                        onSelectCard={setData}
                        size="small"
                      />
                    ))}
                  </Slider>
                ) : (
                  <div className="cards">
                    {notFixedNfts.map((nft, i) => (
                      <NftCard
                        data={nft}
                        key={i}
                        onSelectCard={setData}
                        active={nft === data}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {fixedNfts.length > 0 && (
            <>
              <CommonPageTitle title="收藏夹" subTitle="FAVORITES" size="2" />
              <div className="fixed-driver">
                {fixedNfts.map((nft, i) => (
                  <NftCard
                    data={nft}
                    key={i}
                    size="small"
                    onShowImage={handleImageShow}
                  />
                ))}
              </div>
            </>
          )}
          <div className="more">
            <button className="page-title-button">更多作品阐释</button>
          </div>
        </div>
      </div>
      <NftComfirmModal
        data={data}
        visible={fixModalVisible && !!data}
        onClose={() => showFixModal(false)}
        onOk={handleFixOk}
        text={
          <div>
            <div>保留这个句子？确认后将不可刷新</div>
            <div>
              Fix this Phrase？It would not be refreshed after conformation.
            </div>
          </div>
        }
        title={
          <CommonPageTitle
            title={`保留 #${data ? data.tid : ''}`}
            subTitle={`Fix #${data ? data.tid : ''}`}
            size="3"
          />
        }
        loading={submitting}
      />
      <NftComfirmModal
        data={data}
        visible={refreshModalVisible && !!data}
        onClose={() => showRefreshModal(false)}
        onOk={handleRefreshOk}
        text={
          <div>
            <div>确认刷新驱动器？</div>
            <div>Confirm to refresh this Driver？</div>
          </div>
        }
        title={
          <CommonPageTitle
            title={`刷新 #${data ? data.tid : ''}`}
            subTitle={`Refresh #${data ? data.tid : ''}`}
            size="3"
          />
        }
        loading={submitting}
      />
      <NftAddWrodModal
        data={data}
        visible={addWordModalVisible && !!data}
        onClose={() => showAddWordModal(false)}
        onOk={handleAddWordOk}
        loading={submitting}
      />
      <NftImageModal
        data={currentShowData}
        visible={imgModalVisible && !!data}
        onClose={() => showImageModal(false)}
      />
    </>
  )
}
