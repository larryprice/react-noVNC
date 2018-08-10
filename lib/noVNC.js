import React from 'react'
import PropTypes from 'prop-types'
import RFB from 'novnc-core'

const createConnection = (connectionName, isSecure, onDisconnect, onConnect, onPasswordPrompt, password) => {
  let rfb = null
  try {
    rfb = new RFB(document.getElementById('noVNC-canvas'), `ws${isSecure ? 's' : ''}://${connectionName}`,
      password && {credentials: {password}})
    rfb.addEventListener('connect', onConnect)
    rfb.addEventListener('disconnect', onDisconnect)
    rfb.addEventListener('credentialsrequired', onPasswordPrompt)
    rfb.scaleViewport = true
    rfb.resizeSession = true
  } catch (err) {
    console.error(`Unable to create RFB client: ${err}`)
    return onDisconnect({detail: {clean: false}})
  }

  return rfb
}

export default class VncContainer extends React.Component {
  static propTypes = {
    connectionName: PropTypes.string.isRequired,
    actionsBar: PropTypes.func,
    passwordPrompt: PropTypes.func,
    isSecure: PropTypes.bool,
    password: PropTypes.string
  }

  static defaultProps = {
    isSecure: false
  }

  state = {
    status: 'initializing',
    connectionName: this.props.connectionName,
    passwordRequired: false
  }

  componentDidMount () {
    this.rfb = createConnection(this.props.connectionName, this.props.isSecure,
      this.onDisconnect, this.onStatusChange, this.onPasswordRequired, this.props.password)
  }

  onStatusChange = () => {
    this.rfb.focus()
    this.setState(() => ({status: 'connected'}))
  }

  onDisconnect = e => this.props.onDisconnected(!e.detail.clean || this.state.status !== 'connected')

  onUserDisconnect = () => this.rfb.disconnect()

  onPasswordRequired = () => this.setState(() => ({passwordRequired: true}))

  onSubmitPassword = password => {
    this.rfb.sendCredentials({password})
    this.setState(() => ({passwordRequired: false}))
  }

  render () {
    return (
      <div>
        {this.props.actionsBar &&
          this.props.actionsBar({status: this.state.status, onDisconnect: this.onUserDisconnect})}
        {this.state.passwordRequired &&
          this.props.passwordPrompt({onSubmit: this.onSubmitPassword})}
        <div id='noVNC-canvas' style={{display: this.state.passwordRequired ? 'none' : 'block'}} />
      </div>
    )
  }
}
