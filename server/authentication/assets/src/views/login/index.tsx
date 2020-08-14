import * as React from 'react';
import { render } from 'react-dom';
import './index.scss';
import App from './App';


Object.assign(document, {
    main: async (data: any) => {
        render(
            <React.StrictMode>
                <App {...data} />
            </React.StrictMode>,
            document.getElementById('app')
        )
    }
})