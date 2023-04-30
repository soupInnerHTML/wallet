import React, {useEffect, useState} from "react";
import {wallet} from "../store";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Routes, withParams} from "../router";
import {observer} from "mobx-react-lite";
import {useNextParam} from "../hooks/useNextParam";

export const Auth = observer(() => {
  const [seed, setSeed] = useState('')
  const navigate = useNavigate();
  const next = useNextParam();
  useEffect(() => {
    if(wallet.isAuthenticated) {
      navigate(Routes.WALLET)
    }
  }, [wallet.isAuthenticated])
  return <>
    <p>seed phrase</p>
    <input type="text" value={seed} onChange={e => setSeed(e.target.value)}/>
    <br/>
    <button onClick={async () => {
      const success = await wallet.signIn(seed);
      if(success) {
        navigate(next.still ?? Routes.WALLET)
      }
    }}>sign in</button>

    <br/>
    <button onClick={() => {
      const seed = wallet.create();
      seed && navigate(withParams(Routes.WALLET_CREATION, [seed, "?next=" + next.prepared]))

    }}>create wallet</button>
  </>})
