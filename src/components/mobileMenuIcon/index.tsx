import React from 'react'
import classnames from 'classnames'
import './style.scss'

interface MobileMenuIconProps {
  opened: boolean
  onClick?: () => void
}

const transition =
  'stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1)'

const openedData = [
  {
    strokeDasharray: '90 207',
    strokeDashoffset: '-134',
  },
  {
    strokeDasharray: '1 60',
    strokeDashoffset: '-30',
  },
  {
    strokeDasharray: '90 207',
    strokeDashoffset: '-134',
  },
]

const closedData = [
  {
    strokeDasharray: '60 207',
    strokeDashoffset: '0',
  },
  {
    strokeDasharray: '60 60',
    strokeDashoffset: '0',
  },
  {
    strokeDasharray: '60 207',
    strokeDashoffset: '0',
  },
]

const MobileMenuIcon: React.FC<MobileMenuIconProps> = ({ opened, onClick }) => {
  const data = opened ? openedData : closedData

  return (
    <button className={classnames('ez-menubtn', { opened })} onClick={onClick}>
      <svg viewBox="0 0 100 100">
        <path
          fill="none"
          stroke="black"
          strokeWidth="6"
          strokeDasharray={data[0].strokeDasharray}
          strokeDashoffset={data[0].strokeDashoffset}
          style={{ transition }}
          d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
        />
        <path
          fill="none"
          stroke="black"
          strokeWidth="6"
          strokeDasharray={data[1].strokeDasharray}
          strokeDashoffset={data[1].strokeDashoffset}
          style={{ transition }}
          d="M 20,50 H 80"
        />
        <path
          fill="none"
          stroke="black"
          strokeWidth="6"
          strokeDasharray={data[2].strokeDasharray}
          strokeDashoffset={data[2].strokeDashoffset}
          style={{ transition }}
          d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
        />
      </svg>
    </button>
  )
}

export default MobileMenuIcon
