import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import RootRoute from './routes/index';
import store from './store';
import i18n from './locales/i18n'

const App = () => {
    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <RootRoute/>
            </Provider>
        </I18nextProvider>
    )
}

export default App;
