import { ChainSelector } from '@web3uikit/core';
import React from 'react';
import styled from "styled-components";
import {Chains} from "global/chains";
import {wallet} from "../store";
import {observer} from "mobx-react-lite";

interface ISettingsProps {
}

const SettingsChainSelector = styled(ChainSelector)`
  display: flex;
  width: 60%;
  margin: auto;
`

export const Settings: React.FC<ISettingsProps> = observer(() => {
  return (
    <SettingsChainSelector
      IsMultipleAllowed={false}
      providers={Object.values(Chains)}
      setValue={e => wallet.setChain(e[0].chainId)}
      values={[
        {
          chainId: wallet.chain.chainId
        }
      ]}
    />
  );
});
