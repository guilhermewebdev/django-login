import * as React from 'react';
import useMouseMove from './mouseHook';

type Vector = {
    x: number,
    y: number,
    xDirection: boolean,
    yDirection: boolean,
    xSpeed: number,
    ySpeed: number,
}

const COLORS = ['#F25CA2', '#0433BF', '#032CA6', '#021859', '#0B9ED9', 'black', 'black']
const OUT_TOLERANCE = 500

const getRandomCurveSize = () => Math.floor(Math.random() * 30) + 5
const getRandomColor = () => COLORS[Math.floor(Math.random() * (COLORS.length)) + 0]
const getCoursePoint = (direction: boolean, speed: number): number => direction ? + speed : - speed;

const move = (value: number, speed: number, direction: boolean, maxLimit: number, minLimit: number) => {
    if (value <= minLimit) {
        return { value: value + speed, direction: true }
    }
    if (value >= maxLimit) {
        return { value: value - speed, direction: false }
    }
    return {
        value: value + getCoursePoint(direction, speed),
        direction
    }
}

const getNewVectorPosition = ({ x, y, xDirection, yDirection, xSpeed, ySpeed }: Vector): Vector => {
    const newX = move(x, xSpeed, xDirection, window.innerWidth + OUT_TOLERANCE, -OUT_TOLERANCE)
    const newY = move(y, ySpeed, yDirection, window.innerHeight + OUT_TOLERANCE, -OUT_TOLERANCE)
    return {
        x: newX.value,
        y: newY.value,
        xDirection: newX.direction,
        yDirection: newY.direction,
        xSpeed,
        ySpeed,
    }
};

const getScreenSize = () => ({
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

const getRandomXY = (outScreen?: boolean): Vector => {
    const outs: Array<Boolean> = [false, false]
    if (outScreen) {
        outs[Math.floor(Math.random() * outs.length) + 0] = true;
    }
    const line = {
        x: outScreen ? randomOut(window.innerWidth) : Math.floor(Math.random() * window.innerWidth),
        y: outScreen ? randomOut(window.innerHeight) : Math.floor(Math.random() * window.innerHeight),
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
        const grd = ctx.createLinearGradient(mouse.x, mouse.y, end.x, end.y);
        ctx.restore();
        ctx.beginPath()
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
        ctx.moveTo(start.x, start.y);
        ctx.quadraticCurveTo(control.x, control.y, end.x, end.y);
        ctx.stroke()
        return {
            size,
            start: getNewVectorPosition(start),
            control: getNewVectorPosition(control),
            end: getNewVectorPosition(end),
            speed,
            colors,
        }
    })
}

export default (props: any) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const context = canvas?.getContext('2d');
    const [screenSize, setScreenSize] = React.useState(getScreenSize());
    const mouse = useMouseMove()
    const curves = new Array(20)
        .fill({})
        .map(() => ({
            start: getRandomXY(true),
            control: getRandomXY(),
            end: getRandomXY(true),
            size: getRandomCurveSize(),
            colors: new Array(3)
                .fill('')
                .map(getRandomColor)
        }))
    const updateScreenSize = () => setScreenSize(getScreenSize())
    const keepMaxScreenSize = () => {
        window.addEventListener('resize', updateScreenSize)
        updateScreenSize()
        return () => window.removeEventListener('resize', updateScreenSize);
    }
    const render = (cvs: any): number => {
        const newCvs = draw(context, cvs, mouse.current);
        return requestAnimationFrame(() => render(newCvs))
    }
    const startRendering = () => {
        if (context) {
            const animationId = render(curves);
            const stopAnimation = () => {
                cancelAnimationFrame(animationId);
                context.clearRect(0, 0, screenSize.width, screenSize.height);
                context.restore();
            }
            return stopAnimation
        }
    }

    React.useEffect(startRendering, [context]);

    React.useLayoutEffect(keepMaxScreenSize, [])

    return (
        <canvas
            ref={canvasRef}
            width={screenSize.width}
            height={screenSize.height}
            className="background"
            {...props}
        />
    )
}