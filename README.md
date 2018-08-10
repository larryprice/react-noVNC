# react-noVNC
React component for a noVNC connection

### Usage

Within a React component, you can render this like:

``` javascript
return (
  <NoVNC connectionName={this.props.connectionName}
    onDisconnected={this.onDisconnected}
    isSecure={true}
    actionsBar={(props) => <SomeActionsList onDisconnect={props.onDisconnect} />}
    passwordPrompt={(props) => <SomePasswordComponent onSubmit={props.onSubmit} />}/>
)
```

Props are defined as follows:

* `connectionName`
  * The name of the VNC server to connect to in the form of $ADDRESS:$PORT.
* `onDisconnected`
  * A callback for when the VNC server is disconnected from.
* `isSecure`
  * If true, use the `wss` protocol for secure websockets. Otherwise (by default), use `ws`.
* `actionsBar`
  * Render prop to be displayed above the VNC container to perform actions such as disconnecting.
* `password`
  * Password to be sent when connecting to the VNC server.
* `passwordPrompt`
  * Render prop displayed if a password was not supplied but the VNC server requests a password.

For a demo, see [https://github.com/larryprice/novnc-demos](https://github.com/larryprice/novnc-demos).
