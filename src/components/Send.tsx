import React, {useEffect, useState} from 'react';
import {Button, Input, Typography} from "@web3uikit/core";
import {wallet} from "../store";
import {Loader} from "./Loader";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Routes, withParams} from "../router";
import {Send as SendIcon} from '@web3uikit/icons'
import {ethers} from "ethers";
import {observer} from "mobx-react-lite";
import {Header} from "./Header";

interface ISendProps {
}

export const Send: React.FC<ISendProps> = observer(() => {
  const navigate = useNavigate()
  const [fee, setFee] = useState('')
  const [searchParams] = useSearchParams();
  const [to, setTo] = useState(searchParams.get('to') ?? '')
  const [amount, setAmount] = useState(searchParams.get('amount') ?? '0.001');

  const total = Number(fee) + Number(amount);

  const isEnoughBalance = wallet.balance ? total.toString() <= wallet.balance : true;
  const isSendButtonDisabled = wallet.sendLoading || !isEnoughBalance

  async function send() {
    const hash = await wallet.send(to, amount)
    hash && navigate(withParams(Routes.TRANSACTION_SUCCESS, [hash]));
  }

  useEffect(() => {
    if(to && amount) {
      wallet.getEstimatedTxFee(to, amount).then(estimatedFee => setFee(estimatedFee))
    }
  }, [to, amount])

  return (
    <>
      <Header />
      <form
        style={{display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center'}}
        onSubmit={(e) => {
          e.preventDefault()
          send();
        }}
      >
      <div style={{display: 'flex', flexDirection: 'column', gap: '40px', marginBottom: '12px'}}>
        <Input
          style={{color: '#fff'}}
          labelBgColor={'#282c34'}
          disabled={wallet.sendLoading}
          value={to}
          onChange={e => setTo(e.target.value)}
          type="text"
          label={'To wallet address'}
          placeholder={'0x68258EA339258FbB77Fb857e977F'}
          errorMessage={'Invalid address'}
          state={ethers.utils.isAddress(to || '0x68258EA339258FbB77Fb857e977F3798591F3812') ? 'initial' : 'error'}
        />
        <Input
          labelBgColor={'#282c34'}
          errorMessage={'Insufficient funds'}
          state={!isEnoughBalance ? 'error' : 'initial'}
          disabled={wallet.sendLoading}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          label={'Amount'}
          placeholder={'0.01'}
        />
      </div>

      {fee && <Typography>estimated fee: {fee} {wallet.symbol}</Typography>}
      {fee && <Typography>total: {total} {wallet.symbol}</Typography>}

      <Button
        theme="outline"
        type={'submit'}
        disabled={isSendButtonDisabled}
        icon={<SendIcon />}
        text={'Send'}
      />
      {wallet.sendLoading && <Loader></Loader>}
    </form>
    </>
  );
});
