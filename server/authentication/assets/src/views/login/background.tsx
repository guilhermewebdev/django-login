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
    const colors = ['#F25CA2', '#0433BF', '#032CA6', '#021859', '#0B9ED9', ...new Array(7).fill('black')]
    let curves = new Array(70)
        .fill({})
        .map(() => ({
            start: randomXY(true),
            control: randomXY(),
            end: randomXY(true),
            size: Math.floor(Math.random() * 30) + 5,
            speed: Math.floor(Math.random() * 5) + 1,
            colors: new Array(3).fill('').map(() => (colors[Math.floor(Math.random() * (colors.length)) - 0]))
        }))
    const move = (value: number, speed: number, direction: 0 | 1, reference: number, out: boolean, setDirection: (direction: 1 | 0) => void) => {
        if(out) {
            if (value <= -300) {
                setDirection(1);
                return value + speed;
            }
            if (value >= reference + 300) {
                setDirection(0)
                return value - speed;
            }
        }else{
            if (value <= 0) {
                setDirection(1);
                return value + speed * 2;
            }
            if (value >= reference) {
                setDirection(0)
                return value - speed * 2;
            }
        }
        return direction === 1 ? value + speed : value - speed;
    }
    const getNewPosition = ({ x, y, xDirection, yDirection }: Point, speed: number, out: boolean = false): Point => ({
        x: move(x, speed, xDirection, size.width, out, (direction: 0 | 1) => {
            xDirection = direction;
        }),
        y: move(y, speed, yDirection, size.height, out, (direction: 0 | 1) => {
            yDirection = direction;
        }),
        xDirection,
        yDirection,
    })
    const draw = (ctx: any, cvs: Array<any>) => {
        ctx.restore()
        return cvs.map(({ start, control, end, size, speed, colors }) => {
            const grd = ctx?.createLinearGradient(start.x, start.y, end.x, end.y);
            ctx.fillRect(0, 0, size.width, size.height);
            ctx.restore();
            ctx?.beginPath()
            Object.assign(ctx, {
                fillStyle: grd,
                strokeStyle: grd,
                lineWidth: size,
                shadowBlur: 100,
                shadowColo: 'black',
            })
            grd.addColorStop(0, colors[0])
            grd.addColorStop(0.5, colors[1])
            grd.addColorStop(1, colors[2])
            ctx?.moveTo(start.x, start.y);
            ctx?.quadraticCurveTo(control.x, control.y, end.x, end.y);
            ctx?.fill()
            ctx.closePath()
            return {
                size,
                start: getNewPosition(start, speed, true),
                control: getNewPosition(control, speed),
                end: getNewPosition(end, speed, true),
                speed,
                colors,
            }
        })
    }
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    React.useEffect(() => {
        if (ctx) {
            ctx.clearRect(0, 0, size.width, size.height);
            let cvs = curves;
            let animationId: any;
            const render = () => {
                cvs = draw(ctx, cvs);
                animationId = requestAnimationFrame(render)
            }
            render()
            ctx.save()
            return () => {
                cancelAnimationFrame(animationId)
                ctx.clearRect(0, 0, size.width, size.height);
            }
        }
    }, [ctx, size]);
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