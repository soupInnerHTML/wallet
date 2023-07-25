import {observer} from "mobx-react-lite";
import React, {useEffect, useState} from "react";
import {wallet} from "../store";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {Routes, withParams} from "../router";
import {Loader} from "./Loader";
import {shortcutAddress} from '../utils/shortcut'
import {copyText} from "../utils/copyText";
import {voidHref} from "../global";

export const Wallet = observer(() => {
  const [searchParams] = useSearchParams();
  const [fee, setFee] = useState('')
  const [isSending, setIsSending] = useState(searchParams.get('sending') ?? false)
  const [to, setTo] = useState(searchParams.get('to') ?? '')
  const [amount, setAmount] = useState(searchParams.get('amount') ?? '0.001');
  const navigate = useNavigate()
  const location = useLocation();

  const isEnoughBalance = wallet.balance ? fee + amount <= wallet.balance : true;
  const isSendButtonDisabled = isSending ? wallet.sendLoading || !isEnoughBalance : false

  async function send() {
    const hash = await wallet.send(to, amount)
    hash && navigate(withParams(Routes.TRANSACTION_SUCCESS, [hash]));
  }
  useEffect(() => {
    if(!wallet.isAuthenticated) {
      navigate(`/auth?next=${location.pathname}${location.search.replaceAll("&", "%26")}`)
    }
  }, [wallet.isAuthenticated])

  useEffect(() => {
    if(to && amount) {
      wallet.getEstimatedTxFee(to, amount).then(estimatedFee => setFee(estimatedFee.toString()))
    }
  }, [to, amount])

  return <>
    {wallet.address ? <a
      {...voidHref}
      title={wallet.address}
      onClick={() => copyText(wallet.address!, 'wallet address')}
    >
      {shortcutAddress(wallet.address)}
    </a> : null}
    <br/>
    {wallet.balance ? <a style={{color: '#fff'}} title={wallet.balance + ' ETH'}>
      {Number(wallet.balance).toFixed(6)} ETH
    </a> : <Loader></Loader>}
    <br/>
    {<form onSubmit={(e) => {
      e.preventDefault()
      isSending ? send() : setIsSending(true)
    }}>
      {isSending &&  <>
        <input disabled={wallet.sendLoading} pattern={'0x\\w+'} value={to} onChange={e => setTo(e.target.value)} required type="text" placeholder={'to eth address'}/>
        <input disabled={wallet.sendLoading} step={0.00001} min={0.00001} value={amount} required onChange={e => setAmount(e.target.value)} type="number" placeholder={'amount'}/>
        {fee && <p>estimated fee: {fee} ETH</p>}
        {!isEnoughBalance && <p className={'red'}>Insufficient funds</p>}
      </>}

      <button type={'submit'} disabled={isSendButtonDisabled}>send</button>
      {wallet.sendLoading && <Loader></Loader>}
    </form>}

    <br/>

    <button onClick={() => navigate(Routes.RECEIVE)}>receive</button>

    <br/>

    <button onClick={() => navigate(Routes.HISTORY)}>history of transactions</button>

    <br/>

    <button onClick={() => navigate(Routes.STAKE)}>stake</button>

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
