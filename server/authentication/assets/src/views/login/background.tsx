import * as React from 'react';

export default (props: any) => {
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
    type Point = {
        x: number,
        y: number,
        xDirection: 0 | 1,
        yDirection: 0 | 1
    }
    const randomOut = (reference: number) => {
        const li = [
            () => Math.floor(Math.random()) + reference,
            () => 0 - Math.floor(Math.random()),
        ]
        return li[Math.floor(Math.random() * li.length)]()
    }
    const randomXY = (out?: boolean): Point => {
        const outs = [false, false]
        if (out) {
            outs[Math.floor(Math.random() * outs.length) + 0] = true;
        }
        const line = {
            x: outs[0] ? randomOut(size.width) : Math.floor(Math.random() * size.width),
            y: outs[1] ? randomOut(size.height) : Math.floor(Math.random() * size.height),
        }
        return {
            ...line,
            xDirection: line.x === 0 ? 1 : line.x === size.width ? 0 : Math.floor(Math.random() * 1) + 0 as 0 | 1,
            yDirection: line.x === 0 ? 1 : line.y === size.height ? 0 : Math.floor(Math.random() * 1) + 0 as 0 | 1,
        }
    }
    let curves = new Array(300)
        .fill({})
        .map(() => ({
            start: randomXY(true),
            control: randomXY(),
            end: randomXY(true),
            size: Math.floor(Math.random() * 30),
            speed: Math.floor(Math.random() * 100) + 100,
        }))
    const move = (value: number, speed: number, direction: 0 | 1, reference: number, setDirection: any) => {
        if (value === 0) {
            setDirection(1);
            return value - speed;
        }
        if (value === reference) {
            setDirection(0)
            return value + speed;
        }
        return direction === 1 ? value + speed : value - speed;
    }
    const getNewPosition = (values: any, speed: number): Point => ({
        x: move(values.x, speed, values.xDirection, size.width, (direction: 0 | 1) => {
            values.xDirection = direction;
        }),
        y: move(values.y, speed, values.yDirection, size.height, (direction: 0 | 1) => {
            values.yDirection = direction;
        }),
        ...values,
    })
    const colors = ['green', 'cyan', 'yellow', 'red', 'purple', 'magenta', ...new Array(14).fill('black')]
    const draw = (ctx: any) => {
        ctx.restore()
        return curves.map(({ start, control, end, size, speed }) => {
            const grd = ctx?.createLinearGradient(start.x, start.y, end.x, end.y);
            grd?.addColorStop(0, colors[Math.floor(Math.random() * (colors.length)) - 0]);
            grd?.addColorStop(0.5, colors[Math.floor(Math.random() * (colors.length)) - 0]);
            grd?.addColorStop(1, colors[Math.floor(Math.random() * (colors.length)) - 0]);
            ctx?.beginPath()
            ctx?.moveTo(start.x, start.y);
            ctx?.quadraticCurveTo(control.x, control.y, end.x, end.y);
            Object.assign(ctx, {
                fillStyle: grd,
                strokeStyle: grd,
                lineWidth: size,
            })
            ctx?.stroke();
            return {
                size,
                start: getNewPosition(start, speed),
                control: getNewPosition(control, speed),
                end: getNewPosition(end, speed),
                speed,
            }
        })
    }
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    React.useEffect(() => {
        if (ctx) {
            curves = draw(ctx)
            return () => {
                ctx.restore()
            }
        }
    }, [curves, ctx]);
    // Keep max screen size
    React.useLayoutEffect(() => {
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize);
    }, [window.innerHeight, window.innerWidth])

    return (
        <canvas
            ref={canvasRef}
            width={size.width}
            height={size.height}
            className="background"
            {...props}
        />
    )
}