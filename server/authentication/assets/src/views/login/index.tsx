import * as React from 'react';
import { render } from 'react-dom';
import './index.scss';
import App from './App';


Object.assign(document, {
    main: async () => {
        render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
            document.getElementById('app')
        )
    }
})