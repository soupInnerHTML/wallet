import React from 'react';
import '../css/App.css';
import {observer} from "mobx-react-lite";
import {RouterProvider} from "react-router-dom";
import {router} from "../router";

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default observer(App);
