import * as React from 'react';

// a function that keeps track of mouse coordinates with useRef()
export default () => {
    const getCoords = (clientX?: number, clientY?: number) => ({
        x: clientX || 0,
        y: clientY || 0
    });

    const coords = React.useRef(getCoords()); // ref not state!

    React.useEffect(
        () => {
            function handleMove(event: MouseEvent) {
                coords.current = getCoords(event.clientX, event.clientY);
            }
            document.addEventListener('mousemove', handleMove);
            return () => {
                document.removeEventListener('mousemove', handleMove);
            };
        }
    );
    return coords;
};