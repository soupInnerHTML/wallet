import React, {FC} from 'react';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {wallet} from "../store";
import {Routes} from "../router";
import {useNextParam} from "../hooks/useNextParam";

export const WalletCreation: FC = () => {
  const {seed} = useParams()
  const navigate = useNavigate()
  const next = useNextParam()
  return (
    <>
    <p>
      your seed phrase: {seed}
    </p>
    <p>
      copy and save this phrase, it will be used on login to get access to your wallet
    </p>
    <button onClick={async () => {
      const success = await wallet.signIn(seed!);
      if(success) {
        navigate(next.still ?? Routes.WALLET)
      }
    }}>sing in</button>
    </>
  );
};
