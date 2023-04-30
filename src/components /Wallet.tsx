import {observer} from "mobx-react-lite";
import React, {useEffect, useState} from "react";
import {wallet} from "../store";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {Routes, withParams} from "../router";
import {Loader} from "./Loader";

export const Wallet = observer(() => {
  const [searchParams] = useSearchParams();
  const [isSending, setIsSending] = useState(searchParams.get('sending') ?? false)
  const [to, setTo] = useState(searchParams.get('to') ?? '')
  const [amount, setAmount] = useState(searchParams.get('amount') ?? '0.001');
  const navigate = useNavigate()
  const location = useLocation();
  async function send() {
    const hash = await wallet.send(to, amount)
    hash && navigate(withParams(Routes.TRANSACTION_SUCCESS, [hash]));
  }
  useEffect(() => {
    if(!wallet.isAuthenticated) {
      navigate(`/auth?next=${location.pathname}${location.search.replaceAll("&", "%26")}`)
    }
  }, [wallet.isAuthenticated])

  return <>
    <p>{wallet.address}</p>
    {wallet.balance ? <p>{wallet.balance} ETH</p> : <Loader></Loader>}
    {<form onSubmit={(e) => {
      e.preventDefault()
      isSending ? send() : setIsSending(true)
    }}>
      {isSending &&  <>
        <input disabled={wallet.sendLoading} value={to} onChange={e => setTo(e.target.value)} required type="text" placeholder={'to eth address'}/>
        <input disabled={wallet.sendLoading} min={0.00001} value={amount} required onChange={e => setAmount(e.target.value)} type="number" placeholder={'amount'}/>
      </>}

      <button type={'submit'} disabled={wallet.sendLoading}>send</button>
      {wallet.sendLoading && <Loader></Loader>}
    </form>}

    <br/>

    <button onClick={() => navigate(Routes.RECEIVE)}>receive</button>

    <br/>

    <button onClick={() => navigate(Routes.HISTORY)}>history of transactions</button>

    <br/>

    <button onClick={() => {
      // eslint-disable-next-line no-restricted-globals
      const confirmation = confirm("Are you sure you want to exit your wallet?");
      if(confirmation) {
        navigate(Routes.AUTH);
        wallet.logout()
      }
    }}>quit</button>
  </>
})
