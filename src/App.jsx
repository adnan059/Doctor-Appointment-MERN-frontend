import React from "react";
import DA from "./DA/DA";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "./DA/redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <DA />
      </PersistGate>
    </Provider>
  );
};

export default App;
