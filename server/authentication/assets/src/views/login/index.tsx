import * as React from 'react';
import { render } from 'react-dom';

const div = document.getElementById('app');

render(
    <React.StrictMode>
        <div>Olá mundo</div>
    </React.StrictMode>,
    div
)