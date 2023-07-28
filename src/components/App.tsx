import React, {useEffect, useState} from 'react';
import '../css/App.css';
import {observer} from "mobx-react-lite";
import {RouterProvider} from "react-router-dom";
import {router, Routes} from "../router";
import {MoralisProvider} from 'react-moralis';
import {Button, ButtonProps, Typography, useNotification} from "@web3uikit/core";
import {Toolbox, ChevronRight} from "@web3uikit/icons";
import styled from "styled-components";
import {notification} from "../utils/notification";
import {Header} from "./Header";
import {wallet} from "../store";

const TopButtons = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 12px;
`

const TopButton = styled((props: ButtonProps) => <Button size={'xl'} color="blue" theme={'outline'} iconLayout="icon-only" {...props} />)`
  width: 50px !important;
  height: 50px !important;
  border: 2px solid rgb(188, 215, 240);
`


const BackButton = styled(TopButton)`
  transform: rotate(180deg);
`

function App() {
  const dispatch = useNotification();
  const [pathname, setPathname] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    notification.setNotificationFn(dispatch);
    router.subscribe(e => {
      setPathname(e.location.pathname)
      setSearch(e.location.search)
    })
  }, [])

  useEffect(() => {
    if(!wallet.isAuthenticated) {
      router.navigate(`/auth?next=${pathname}${search.replaceAll("&", "%26")}`)
    }
  }, [wallet.isAuthenticated])

  const isInitialRoute = pathname === Routes.WALLET || pathname === Routes.AUTH;
  return (
    <MoralisProvider serverUrl={'http://localhost:1337/server'} appId={'20b66896-0682-4aba-a4d4-7a411402117a'}>
      <div className="App">
        <TopButtons>
          {!isInitialRoute && <BackButton
            icon={<ChevronRight fontSize={'24px'}/>}
            onClick={() => router.navigate(-1)}
          />}
          {pathname !== Routes.AUTH && pathname !== Routes.SETTINGS &&
            <Typography title={'Settings'}>
              <TopButton
                icon={<Toolbox fontSize={'24px'}/>}
                onClick={() => router.navigate(Routes.SETTINGS)}
              />
            </Typography>
          }
        </TopButtons>
        {!isInitialRoute && <Header />}
        <RouterProvider router={router} />
      </div>
    </MoralisProvider>
  );
}

export default observer(App);
