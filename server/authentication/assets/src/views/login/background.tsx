import * as React from 'react';

export default () => {
    const sizeFactory = () => ({
        height: window.innerHeight,
        width: window.innerWidth
    })
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [size, setSize] = React.useState(sizeFactory());
    const updateSize = () => {
        setSize(sizeFactory())
    }
    // Draw in canvas
    React.useEffect(() => {
        if(canvasRef.current){
            const canvas: HTMLCanvasElement = canvasRef.current;
            const context = canvas.getContext('2d');

        }
    });
    // Keep max screen size
    React.useLayoutEffect(() => {
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize);
    }, [])

    return (
        <canvas
            ref={canvasRef}
            width={size.width}
            height={size.height}
            className="background"
        />
    )
}