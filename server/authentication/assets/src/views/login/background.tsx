import * as React from 'react';

export default () => {
    const sizeFactory = () => ({
        height: window.innerHeight,
        width: window.innerWidth
    })
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [size, setSize] = React.useState(sizeFactory());
    const [position, setPosition] = React.useState({
        x: 0,
        y: 0,
    })
    const updateSize = () => {
        setSize(sizeFactory())
    }
    // Draw in canvas
    React.useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const randomXY = () => ({
            x: Math.floor(Math.random() * size.width),
            y: Math.floor(Math.random() * size.height),
        })
        const curves = new Array(30)
            .fill({})
            .map(() => ({
                start: randomXY(),
                control: randomXY(),
                end: randomXY(),
                size: Math.floor(Math.random() * 30)
            }))
        // Fill with gradient

        const render = () => {
            ctx?.clearRect(0, 0, size.width, size.height);
            curves.forEach(({ start, control, end, size }, index) => {
                const grd = ctx?.createLinearGradient(start.x, start.y, end.x, end.y);
                grd?.addColorStop(0, 'green');
                grd?.addColorStop(0.5, 'cyan');
                grd?.addColorStop(1, 'green');
                ctx?.beginPath()
                ctx?.moveTo(start.x, start.y);
                ctx?.quadraticCurveTo(control.x, control.y, end.x, end.y);
                Object.assign(ctx, {
                    fillStyle: grd,
                    strokeStyle: grd,
                    lineWidth: size,
                })
                ctx?.stroke();
            })
            return requestAnimationFrame(render);
        }
        const requestId = render();
        return () => (cancelAnimationFrame(requestId));
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