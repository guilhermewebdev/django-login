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
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const grd = ctx?.createLinearGradient(0, 0, size.width, size.height);
        const render = () => {
                ctx?.clearRect(0, 0, size.width, size.height);
                ctx?.beginPath();
            if (canvasRef.current) {
                grd?.addColorStop(0, "red");
                grd?.addColorStop(0.5, "transparent");
                grd?.addColorStop(1, "black");

                // Fill with gradient
                Object.assign(ctx, {
                    fillStyle: grd
                })
                ctx?.fillRect(0, 0, size.width, size.height);

            }
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