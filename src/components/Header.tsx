import React from 'react';
import styled from "styled-components";
import {Blockie} from "@web3uikit/web3";
import {wallet} from "../store";
import {observer} from "mobx-react-lite";
import {Skeleton} from "@web3uikit/core";
import {Text} from "../@library/Text";
import {WalletAddress} from "../@library/WalletAddress";
import {WalletCard} from "../@library/WalletCard";

interface IHeaderProps {
}

const HeaderRow = styled.div`
  display: flex;
  gap: 12px;
  position: absolute;
  right: 16px;
  top: 16px;
  align-items: center;
`

export const Header: React.FC<IHeaderProps> = observer(() => {
  return (
    <HeaderRow>
      {wallet.balance ? <Text
        title={wallet.balance}
      >
        {wallet.niceBalance}
      </Text> : <Skeleton
        theme={'text'}
        width={'100px'}
        height={'24px'}
        backgroundColor={'#414754'}
      />}
      <WalletAddress></WalletAddress>
      {wallet.address ?
        <WalletCard>
          <Blockie seed={wallet.address} />
        </WalletCard> :
        <Skeleton
          theme={'image'}
          borderRadius={'32px'}
          width={'32px'}
          height={'32px'}
          backgroundColor={'#414754'}
        />
      }
    </HeaderRow>
  );
});


