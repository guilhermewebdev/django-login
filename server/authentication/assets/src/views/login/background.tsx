import * as React from 'react';

type Point = {
    x: number,
    y: number,
    xDirection: boolean,
    yDirection: boolean,
    xSpeed: number,
    ySpeed: number,
}

const move = (value: number, speed: number, direction: boolean, reference: number, client: number, setDirection: (direction: boolean) => void) => {
    if (value <= -500) {
        setDirection(true);
        return value + speed;
    }
    if (value >= reference + 500) {
        setDirection(false)
        return value - speed;
    }

    return direction ? value + speed : value - speed;
}

const getNewPosition = ({ x, y, xDirection, yDirection, xSpeed, ySpeed }: Point, mouse: any): Point => {
    return {
        x: move(x, xSpeed, xDirection, window.innerWidth, mouse.x, (direction: boolean) => {
            xDirection = direction;
        }),
        y: move(y, ySpeed, yDirection, window.innerHeight, mouse.y, (direction: boolean) => {
            yDirection = direction;
        }),
        xDirection,
        yDirection,
        xSpeed,
        ySpeed,
    }
};

const sizeFactory = () => ({
    height: window.innerHeight,
    width: window.innerWidth
})

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
        x: out ? randomOut(window.innerWidth) : Math.floor(Math.random() * window.innerWidth),
        y: out ? randomOut(window.innerHeight) : Math.floor(Math.random() * window.innerHeight),
    }
    return {
        ...line,
        xDirection: Math.floor(Math.random() * 10) > 4,
        yDirection: Math.floor(Math.random() * 10) > 4,
        xSpeed: Math.floor(Math.random() * 2),
        ySpeed: Math.floor(Math.random() * 2),
    }
}

const draw = (ctx: any, cvs: Array<any>, mouse: any) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    return cvs.map(({ start, control, end, size, speed, colors }) => {
        const grd = ctx?.createLinearGradient(start.x, start.y, end.x, end.y);
        ctx.restore();
        ctx?.beginPath()
        Object.assign(ctx, {
            fillStyle: grd,
            strokeStyle: grd,
            lineWidth: size,
        })
        grd.addColorStop(0, 'black')
        grd.addColorStop(0.3, colors[0])
        grd.addColorStop(0.5, colors[1])
        grd.addColorStop(0.7, colors[2])
        grd.addColorStop(1, 'black')
        ctx?.moveTo(start.x, start.y);
        ctx?.quadraticCurveTo(control.x, control.y, end.x, end.y);
        ctx?.stroke()
        return {
            size,
            start: getNewPosition(start, mouse),
            control: getNewPosition(control, mouse),
            end: getNewPosition(end, mouse),
            speed,
            colors,
        }
    })
}

const render = (context: any, cvs: any, mouse: any) => {
    const newCvs = draw(context, cvs, mouse);
    const animationId = requestAnimationFrame(() => {
        render(context, newCvs, mouse);
    })
    return { newCvs, animationId, context, mouse };
}

export default (props: any) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const [size, setSize] = React.useState(sizeFactory());
    const [mouse, setMouse] = React.useState({
        x: 0,
        y: 0,
    })
    const colors = ['#F25CA2', '#0433BF', '#032CA6', '#021859', '#0B9ED9', 'black', 'black']
    const [curves, setCurves] = React.useState(new Array(20)
        .fill({})
        .map(() => ({
            start: randomXY(true),
            control: randomXY(),
            end: randomXY(true),
            size: Math.floor(Math.random() * 30) + 5,
            colors: new Array(3).fill('').map(() => (colors[Math.floor(Math.random() * (colors.length)) - 0]))
        }))
    )
    const updateSize = () => {
        setSize(sizeFactory())
    }

    React.useEffect(() => {
        if (ctx) {
            
            const { newCvs, animationId, context } = render(ctx, curves, mouse)
            setCurves(newCvs)
            return () => {
                cancelAnimationFrame(animationId)
                context.clearRect(0, 0, size.width, size.height);
                context.restore()
            }
        }
    }, [ctx, size]);
    // Keep max screen size
    React.useLayoutEffect(() => {
        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize);
    }, [window.innerHeight, window.innerWidth])
    const setPositionMouse = (event: MouseEvent) => {
        setMouse({
            x: event.clientX,
            y: event.clientY,
        })
    }
    React.useLayoutEffect(() => {
        window.addEventListener('mousemove', setPositionMouse)
        return () => window.removeEventListener('mousemove', setPositionMouse)
    }, [mouse])
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