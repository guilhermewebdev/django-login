import * as React from 'react';
import { render } from 'react-dom';
import './index.scss';

const div = document.getElementById('app');

Object.assign(document, {
    main: async function () {
        render(
            <React.StrictMode>
                <div className="container">Olá mundo</div>
            </React.StrictMode>,
            div
        )
    }
})