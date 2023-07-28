import {observer} from "mobx-react-lite";
import React from "react";
import {wallet} from "../store";
import {useNavigate} from "react-router-dom";
import {Routes} from "../router";
import {Blockie} from "@web3uikit/web3";
import {Button, Skeleton, Tag} from "@web3uikit/core";
import {Chest, Copy, Gift, List, LogOut, NftCat, Send} from '@web3uikit/icons'
import {Text} from "../@library/Text";
import styled from "styled-components";
import {shortcutAddress} from "../utils/shortcut";
import {copyAddress} from "../utils/copyText";

const WalletDetails = styled.div`
 background: #ffffff;
  margin-bottom: 40px;
  border-radius: 12px;
  padding: 12px;
  border: 2px solid rgb(188, 215, 240);
`

const WalletAddress = styled(Tag)`
  flex-direction: row-reverse;
  gap: 4px;
  cursor: pointer;
`

const TextPlaceholder = () => <Skeleton theme={'text'} width={'148px'} height={'24px'}></Skeleton>

export const Wallet = observer(() => {

  const navigate = useNavigate()

  function quit() {
    // eslint-disable-next-line no-restricted-globals
    const confirmation = confirm("Are you sure you want to exit your wallet?");
    if(confirmation) {
      navigate(Routes.AUTH);
      wallet.logout()
    }
  }

  return <>
    <WalletDetails>
    {wallet.address && <Blockie seed={wallet.address} size={20} />}
    {wallet.address ? <div onClick={() => copyAddress(wallet.address!)}>
      <WalletAddress
        color={'blue'}
        text={shortcutAddress(wallet.address!)}
        prefixIcon={<Copy/>}
      />
    </div> : <TextPlaceholder />}
    {wallet.balance ? <Text
      variant="body18"
      color={'dark'}
      title={wallet.balance}
    >
      {Number(wallet.balance).toFixed(6)} {wallet.symbol}
    </Text> : <TextPlaceholder />}
    </WalletDetails>

    <div style={{display: 'flex', gap: '12px'}}>
      <Button
        theme="outline"
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
