import React, {FC, useState} from 'react';
import {wallet} from "../store";
import {observer} from "mobx-react-lite";

import config from '../config.json'
import {Text, Button} from "@library";

enum Type {
  wallet, payment
}

export const Receive: FC = observer(() => {
  const [type, setType] = useState(Type.wallet);
  const [amount, setAmount] = useState('0.1');
  const link = `${config.baseUrl}/send?to=${wallet.address}&amount=${amount}`
  return type === Type.wallet ? (
    <>
      <img src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${wallet.address}&choe=UTF-8`} alt=""/>
      <br/>
      <Text variant={'h1'}>{wallet.address}</Text>
      <br/>
      <Button onClick={() => setType(Type.payment)} text={'Request payment'} />
    </>
  ): (
    <>
      <img src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${link.replaceAll("&", "%26")}&choe=UTF-8`} alt=""/>
      <br/>
      <input type="number" min={0.000001} value={amount} onChange={e => setAmount(e.target.value)}/>
      <br/>
      <Text variant={'h2'}>copy this link and share with sender or qr code</Text>
      <br/>
      <a href={link}>{link}</a>
    </>
  );
});
