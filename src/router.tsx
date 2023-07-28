import {createBrowserRouter} from "react-router-dom";
import {Auth, TransactionSuccess, Wallet} from "./components";
import React from "react";
import {Receive} from "./components/Receive";
import {WalletCreation} from "./components/WalletCreation";
import {History} from "./components/History";
import {Stake} from "./components/Stake";
import {Nft} from "./components/Nft";
import {Send} from "./components/Send";
import {Settings} from "./components/Settings";

export function withParams(route: string, params: string[], isRouterCreation?: boolean) {
  return `${route}/${isRouterCreation ? ':' : ''}${params.join(isRouterCreation ? '/:' : '/')}`
}
export const Routes = {
  WALLET: '/',
  AUTH: '/auth',
  WALLET_CREATION: '/wallet-creation',
  TRANSACTION_SUCCESS: "/transaction-success",
  RECEIVE: '/receive',
  HISTORY: '/history',
  STAKE: '/stake',
  NFT: '/nft',
  SEND: '/send',
  SETTINGS: '/settings'
}

export const router = createBrowserRouter([
  {
    path: Routes.WALLET,
    element: <Wallet />,
  },
  {
    path: Routes.AUTH,
    element: <Auth />,
  },
  {
    path: Routes.RECEIVE,
    element: <Receive />,
  },
  {
    path: withParams(Routes.TRANSACTION_SUCCESS, ['hash'], true),
    element: <TransactionSuccess />,
  },
  {
    path: withParams(Routes.WALLET_CREATION, ['seed'], true),
    element: <WalletCreation />,
  },
  {
    path: Routes.HISTORY,
    element: <History />,
  },
  {
    path: Routes.STAKE,
    element: <Stake />,
  },
  {
    path: Routes.NFT,
    element: <Nft />,
  },
  {
    path: Routes.SEND,
    element: <Send />,
  },
  {
    path: Routes.SETTINGS,
    element: <Settings />,
  },
]);
