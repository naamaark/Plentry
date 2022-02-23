import React from 'react';
import ReactDOM from 'react-dom';
import RootCmp from './root-cmp';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import  rootReducer  from './reducers/rootReducer'

const store = createStore(rootReducer)

ReactDOM.render(

  <React.StrictMode>
    <Provider store={store}>
      <RootCmp />
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

reportWebVitals();
