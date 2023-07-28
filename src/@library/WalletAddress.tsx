import React from 'react';
import {Text} from "./Text";
import {wallet} from "../store";
import {CopyButton, Skeleton} from "@web3uikit/core";
import {WalletCard} from "./WalletCard";
import {observer} from "mobx-react-lite";

interface IWalletAddressProps {
}

export const WalletAddress: React.FC<IWalletAddressProps> = observer((props) => {
  return wallet.address ? (
    <WalletCard {...props}>
      <Text
        color={'dark'}
        title={wallet.address}
      >
        {wallet.niceAddress}
      </Text>
      <div style={{width: '32px'}}>
        <CopyButton
          text={wallet.address}
        />
      </div>
    </WalletCard>
  ) : (
    <Skeleton
      theme={'text'}
      width={'100px'}
      height={'24px'}
      backgroundColor={'#414754'}
    />
  );
});
