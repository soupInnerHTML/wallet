import React, {FC, useEffect} from 'react';
// @ts-ignore
import console from 'console-browserify'
import {wallet} from "../store";
import {observer} from "mobx-react-lite";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {ethers} from "ethers";
import {history} from "../store/History";
import {Table, Tag, Typography} from "@web3uikit/core";
import styled from "styled-components";
import {shortcutAddress} from "../utils/shortcut";
import {Link, LinkProps} from "react-router-dom";
import {copyAddress} from "../utils/copyText";
import {Blockie} from "@web3uikit/web3";

dayjs.extend(relativeTime);

const HistoryTable = styled(Table)`
  margin-top: 60px;
`

const TableLink = styled((props: LinkProps) => <Link {...props} target={'_blank'} />)`
  color: rgb(0, 90, 194);
`

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const History: FC = observer(() => {
  useEffect(() => {
    wallet.address && history.fetchTransactions(wallet.address).then(() => {
      console.log(history.transactions)
    })
  }, [wallet.address])
  return <HistoryTable
    columnsConfig="1fr 1fr 1fr 1fr 1fr 80px 1fr 1fr 1fr"
    pageSize={10}
    header={[
      <span>Transaction Hash</span>,
      <span>Method</span>,
      <span>Block</span>,
      <span>Age</span>,
      <span>From</span>,
      '',
      <span>To</span>,
      <span>Value</span>,
      <span>Fee</span>,
    ]}
    data={history.transactions.map((tx) => {
      const isOut = tx.from === wallet.address
      return [
        <TableLink to={wallet.getLink('tx', tx.hash)}>{shortcutAddress(tx.hash)}</TableLink>,
        <Tag color={'purple'} text={'Transfer'}/>,
        tx.blockNumber ? <TableLink to={wallet.getLink('block', tx.blockNumber.toString())} target={'_blank'}>{tx.blockNumber}</TableLink> : '',
        tx.timestamp ? <Typography title={dayjs(tx.timestamp * 1000).format('DD.MM.YYYY HH:mm:ss')}>
          {dayjs(tx.timestamp * 1000).toNow(true)} ago
        </Typography> : '',
        <Row>
          <Blockie seed={tx.from} />
          <Typography copyable onCopy={() => copyAddress(tx.from)}>
            <TableLink to={wallet.getLink('address', tx.from)}>{shortcutAddress(tx.from)}</TableLink>
          </Typography>
        </Row>,
        <Tag color={isOut ? "yellow" : 'green'} text={isOut ? 'out' : 'in'}/>,
        tx.to ? <Row>
          <Blockie seed={tx.to} />
          <Typography copyable onCopy={() => copyAddress(tx.to!)}>
            <TableLink to={wallet.getLink('address', tx.to)}>{shortcutAddress(tx.to)}</TableLink>
          </Typography>
        </Row>: "",
        wallet.symbolical(+ethers.utils.formatEther(tx.value)),
        wallet.symbolical(+Number(ethers.utils.formatUnits(tx.gasLimit.mul(tx.gasPrice!))).toFixed(7))
      ]
    })}
    isLoading={history.isLoading}
    alignCellItems={'center'}
    justifyCellItems={'center'}
  />
});
