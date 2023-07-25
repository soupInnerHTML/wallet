import React, {FC, useEffect} from 'react';
import {wallet} from "../store";
import {observer} from "mobx-react-lite";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {InIcon, OutIcon} from 'assets'
import {ethers} from "ethers";
import {Loader} from "./Loader";

dayjs.extend(relativeTime)

export const History: FC = observer(() => {
  useEffect(() => {
    wallet.address && wallet.getHistory(wallet.address)
  }, [])
  if(wallet.historyLoading) {
    return <Loader></Loader>
  }
  else {
    return <>
      {wallet.history.map((tx) => {
        const isOut = tx.from === wallet.address
        return <div className={'history-item'}>
          <img title={isOut ? 'out' : 'in'} className={'history-item-type'} src={isOut ? OutIcon : InIcon} alt=""/>
          <a href={wallet.getLink('address', tx.from)} target={'_blank'}>from: {tx.from}</a>
          <br/>
          <a href={tx.to && wallet.getLink('address', tx.to)} target={'_blank'}>to: {tx.to}</a>
          <br/>
          <p>{ethers.utils.formatEther(tx.value)} ETH</p>
          <p>fee: {ethers.utils.formatUnits(tx.gasLimit.mul(tx.gasPrice!))} ETH</p>
          <p>{dayjs(tx.timestamp! * 1000).toNow(true)} ago</p>
          <a href={wallet.getLink('tx', tx.hash)} target={'_blank'}>check transaction on etherscan</a>
        </div>
      })}
    </>
  }
});
