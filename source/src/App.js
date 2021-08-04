import React from 'react';
import { Provider } from 'react-redux';

import RootRoute from './routes/index';
import configureStore from './store';

const store = configureStore();

const App = () => {
    return (
        <Provider store={store}>
           <RootRoute/>
        </Provider>
    )
}

export default App;
