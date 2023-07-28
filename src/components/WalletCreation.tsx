import React, {FC} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {wallet} from "../store";
import {Routes} from "../router";
import {useNextParam} from "../hooks/useNextParam";
import {copyText} from "../utils/copyText";

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
      <a
        onClick={() => copyText(seed!, 'seed phrase')}
      >
        copy
      </a>
      and save this phrase, it will be used on login to get access to your wallet
    </p>
    <button onClick={async () => {
      const success = await wallet.signInBySeed(seed!);
      if(success) {
        navigate(next.still ?? Routes.WALLET)
      }
    }}>sing in</button>
    </>
  );
};
