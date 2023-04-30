import React, {FC} from 'react';
import {Link, useParams} from "react-router-dom";
import {Routes} from "../router";
import {wallet} from "../store";

export const TransactionSuccess: FC = () => {
  const {hash} = useParams()
  return (
    <div>
      <h1>Success</h1>
      <p>Your txid: {hash}</p>
      <a href={hash && wallet.getLink('tx', hash)} target={'_blank'} rel={'noreferrer'}>check on etherscan</a>
      <br/>
      <br/>
      <Link to={Routes.WALLET}>back to wallet details</Link>
    </div>
  );
};
