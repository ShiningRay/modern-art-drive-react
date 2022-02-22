/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import PersonIcon from '@material-ui/icons/Person'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import { blue } from '@material-ui/core/colors'
import { createContainer } from 'unstated-next'
import { LoginType } from '../../constants'
import Unipass from '../../store/unipass'

const useStyles = makeStyles({
  p: {
    textAlign: 'center',
  },
})

export interface SimpleDialogProps {
  open: boolean
  onClose: () => void
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles()

  const { onClose, open } = props
  const { fLogin, login } = Unipass.useContainer()

  const handleClose = () => {
    onClose()
  }

  const handleListItemClick = (type: LoginType) => {
    if (type === LoginType.Unipass) {
      login()
    } else if (type === LoginType.Flashsigner) {
      fLogin()
    }
    onClose()
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">选择钱包</DialogTitle>
      <List>
        <ListItem
          autoFocus
          button
          onClick={() => handleListItemClick(LoginType.Unipass)}
        >
          <ListItemText className={classes.p} primary="Unipass" />
        </ListItem>
        <ListItem
          autoFocus
          button
          onClick={() => handleListItemClick(LoginType.Flashsigner)}
        >
          <ListItemText className={classes.p} primary="Flashsigner" />
        </ListItem>
      </List>
    </Dialog>
  )
}

function loginDialogControl() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState<boolean>(false)

  return {
    open,
    setOpen,
  }
}

const LoginDialogControl = createContainer(loginDialogControl)

export { LoginDialogControl }

export default function LoginDialog() {
  const { open, setOpen } = LoginDialogControl.useContainer()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <SimpleDialog open={open} onClose={handleClose} />
    </div>
  )
}
