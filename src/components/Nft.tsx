import React, {useEffect} from 'react';
import {wallet} from "../store";
import {observer} from "mobx-react-lite";
import {useNFTBalances} from "react-moralis";
// @ts-ignore
import console from 'console-browserify'
import {Loader} from "./Loader";
import {Card} from "@web3uikit/core";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {nft as nftStore} from '../store/Nft'

interface INftProps {}

const NftCard = styled(Card)`
  width: 20vw !important;
  padding-top: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

const NftList = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 60px 0;
`

const NftLogo = styled.img`
  width: 100%;
  border-radius: 20px 20px 0 0
`

export const Nft: React.FC<INftProps> = observer(() => {
  const { getNFTBalances, data} = useNFTBalances();
  useEffect(() => {
    if(wallet.address) {
      getNFTBalances({
        params: {
          chain: "goerli",
          address: wallet.address
        }
      })
    }
  }, [wallet.address])

  useEffect(() => {
    console.log(data)
    if(data?.result) {
      data.result.forEach(nft => {
        nft && nftStore.load(nft)
        console.log(nft)
      })
    }
  }, [data])
  return (
    <NftList>
      {!nftStore.loading ? nftStore.data.map(nft => (
        <Link key={nft.uri} to={nft.uri} target={'_blank'}>
          <NftCard title={nft.name}>
            <NftLogo
              src={nft.image}
              alt={''}
            />
          </NftCard>
        </Link>
      )) : <Loader />}
    </NftList>
  );
});
