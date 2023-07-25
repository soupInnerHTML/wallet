import React, {useEffect, useState} from "react";
import {wallet} from "../store";
import {useNavigate} from "react-router-dom";
import {Routes, withParams} from "../router";
import {observer} from "mobx-react-lite";
import {useNextParam} from "../hooks/useNextParam";

enum AuthType {
  seed, privateKey
}

export const Auth = observer(() => {
  const [authType, setAuthType] = useState(AuthType.seed)
  const [credentials, setCredentials] = useState('')
  const [isCredentialsVisible, setCredentialsVisible] = useState(false)
  const navigate = useNavigate();
  const next = useNextParam();
  useEffect(() => {
    if(wallet.isAuthenticated) {
      navigate(Routes.WALLET)
    }
  }, [wallet.isAuthenticated])

  function switchAuthType() {
      setAuthType(authType => authType === AuthType.seed ? AuthType.privateKey : AuthType.seed)
  }

  async function signIn() {
      const success = await wallet[authType === AuthType.seed ? 'signInBySeed' : 'signInByPrivateKey'](credentials);
      if(success) {
        navigate(next.still ?? Routes.WALLET)
      }
  }

  function createWallet() {
    const seed = wallet.create();
    seed && navigate(withParams(Routes.WALLET_CREATION, [seed, next.prepared ? "?next=" + next.prepared : '']))
  }

  function toggleCredentialsVisible() {
    setCredentialsVisible(actual => !actual)
  }


  return <>
    <p>{authType === AuthType.seed ? 'seed phrase' : 'private key'}</p>
    <input
      type={isCredentialsVisible ? "text" : "password"}
      value={credentials}
      onChange={e => setCredentials(e.target.value)}
    />

    <div style={{display: 'flex', alignItems: 'center'}}>
      <input type="checkbox" onClick={toggleCredentialsVisible} />
      <label style={{fontSize: '12px'}}>show {authType === AuthType.seed ? 'seed phrase' : 'private key'}</label>
    </div>

    <button onClick={switchAuthType}>
      switch to {authType === AuthType.seed ? 'private key' : 'seed phrase'}
    </button>

    <br/>

    <button onClick={signIn}>sign in</button>

    <br/>

    <button onClick={createWallet}>
      create wallet
    </button>
  </>})
