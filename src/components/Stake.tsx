import React, {FC, useEffect, useState} from 'react';
import {wallet} from "../store";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {Routes, withParams} from "../router";
import {Loader} from "./Loader";
import {stake as stakeStore} from "store";

export const Stake: FC = observer(() => {
  const [stakingAmount, setStakingAmount] = useState('0.001');
  const navigate = useNavigate();
  useEffect(() => {
    stakeStore.getStakedTokens()
    stakeStore.getStakedPeriod()
  }, [])
  return (
    <div>
      {stakeStore.staked ? <p>staked: {stakeStore.staked} {wallet.symbol}</p> : <Loader />}
      <br/>
      <input min={'0.001'} value={stakingAmount} onChange={e => setStakingAmount(e.target.value)} type="number"/>
      <button onClick={async () => {
        const txid = await stakeStore.stake(stakingAmount);
        txid && navigate(withParams(Routes.TRANSACTION_SUCCESS, [txid]))
      }}>stake on 30 days</button>
      <button onClick={() => stakeStore.unstake()}>unstake all*</button>

      <p>* you can't unstake ETH until staked period ends</p>
    </div>
  );
});
