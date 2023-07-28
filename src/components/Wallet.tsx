import {observer} from "mobx-react-lite";
import React, {useEffect} from "react";
import {wallet} from "../store";
import {useLocation, useNavigate} from "react-router-dom";
import {Routes} from "../router";
import {Loader} from "./Loader";
import {Blockie} from "@web3uikit/web3";
import {Button} from "@web3uikit/core";
import {Gift,  List, LogOut, NftCat, Send, Chest} from '@web3uikit/icons'
import {Text} from "../@library/Text";
import {WalletAddress as WA} from "../@library/WalletAddress";
import styled from "styled-components";

const WalletAddress = styled(WA)`
  height: 36px;
  margin: 12px 0;
`

export const Wallet = observer(() => {

  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    if(!wallet.isAuthenticated) {
      navigate(`/auth?next=${location.pathname}${location.search.replaceAll("&", "%26")}`)
    }
  }, [wallet.isAuthenticated])

  function quit() {
    // eslint-disable-next-line no-restricted-globals
    const confirmation = confirm("Are you sure you want to exit your wallet?");
    if(confirmation) {
      navigate(Routes.AUTH);
      wallet.logout()
    }
  }

  return <>
    {wallet.address  && <Blockie seed={wallet.address} size={20} />}
    <WalletAddress />
    {wallet.balance ? <Text
      variant="body18"
      title={wallet.balance}
    >
      {Number(wallet.balance).toFixed(6)} {wallet.symbol}
    </Text> :
      <Loader></Loader>}
    <br/>

    <div style={{display: 'flex', gap: '12px'}}>
      <Button
        theme="outline"
        type={'submit'}
        icon={<Send />}
        text={'Send'}
        onClick={() => navigate(Routes.SEND)}
      />

      <Button
        text={'Receive'}
        theme="outline"
        onClick={() => navigate(Routes.RECEIVE)}
        icon={<Gift />}
      />

      <Button
        theme="outline"
        text={'History'}
        onClick={() => navigate(Routes.HISTORY)}
        icon={<List />}
      />

      <Button
        theme="outline"
        text={'Stake'}
        onClick={() => navigate(Routes.STAKE)}
        icon={<Chest></Chest>}
      />

      <Button
        theme="outline"
        text={'NFT'}
        onClick={() => navigate(Routes.NFT)}
        icon={<NftCat></NftCat>}
      />

      <Button
        theme="colored"
        color="red"
        icon={<LogOut />}
        text={'Quit'}
        onClick={quit}/>

    </div>
  </>
})
