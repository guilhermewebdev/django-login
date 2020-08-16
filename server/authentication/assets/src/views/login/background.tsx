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
            const ctx = canvas.getContext('2d');
            const grd = ctx?.createLinearGradient(0, 0, size.width, 0);
            grd?.addColorStop(0, "red");
            grd?.addColorStop(0.5, "white");
            ctx?.fillStyle = grd;
            Object.assign(ctx, {
                fillStyle: grd
            })

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