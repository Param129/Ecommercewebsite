import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import {Provider} from "react-redux";

import store from "./store";

import {positions,transitions,Provider as Alertprovider} from "react-alert";

import AlertTemplate from "react-alert-template-basic";

const options={
    timeout:5000,//sec
    positions:positions.BOTTOM_CENTER,
    transitions:transitions.SCALE

}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>

    <Alertprovider tamplate={AlertTemplate} {...options}>
    <App />
    </Alertprovider>
    
  </Provider>
);


