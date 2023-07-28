import React, {useEffect} from 'react';
import '../css/App.css';
import {observer} from "mobx-react-lite";
import {RouterProvider} from "react-router-dom";
import {router} from "../router";
import {MoralisProvider} from 'react-moralis';
import {Button, useNotification} from "@web3uikit/core";
import {List} from "@web3uikit/icons";
import styled from "styled-components";
import {notification} from "../utils/notification";

const Settings = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
`

function App() {
  const dispatch = useNotification();

  useEffect(() => {
    notification.setNotificationFn(dispatch)
  }, [])
  return (
    <MoralisProvider serverUrl={'http://localhost:1337/server'} appId={'20b66896-0682-4aba-a4d4-7a411402117a'}>
      <div className="App">
        <Settings>
            <Button icon={<List></List>} text={''}></Button>
        </Settings>
        <RouterProvider router={router} />
      </div>
    </MoralisProvider>
  );
}

export default observer(App);
