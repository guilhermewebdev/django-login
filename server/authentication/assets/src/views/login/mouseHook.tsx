import * as React from 'react';

const getCoords = (clientX?: number, clientY?: number) => ({
    x: clientX || 0,
    y: clientY || 0
});

export default () => {
    const coords = React.useRef(getCoords());
    const handleMove = (event: MouseEvent) => coords.current = getCoords(event.clientX, event.clientY);
    const watchMousePosition = () => {
        document.addEventListener('mousemove', handleMove);
        const removeListener = () => document.removeEventListener('mousemove', handleMove);
        return removeListener
    }
    React.useEffect(watchMousePosition);
    return coords;
};