import App from "./components/app"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import Favicon from 'react-favicon';

import store from "./store"

ReactDOM.render(
    <Provider store = {store}>
        <Favicon url="https://writer-sm.up.railway.app/media/img/SMLogo.png" />
        <App />
    </Provider>  , document.querySelector(".main"))