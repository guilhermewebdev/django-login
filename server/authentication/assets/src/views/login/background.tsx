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
const MAX_SPEED = 2
const CURVES_AMOUNT = 35
const CURVE_COLORS_AMOUNT = 6
const MAX_CURVE_SIZE = 10
const MIN_CURVE_SIZE = 1

const getRandomValue = (max: number, min?: number) => Math.floor(Math.random() * max) + (!!min ? min : 0)
const getRandomColor = () => COLORS[getRandomValue(COLORS.length, 0)]
const getCoursePoint = (direction: boolean, speed: number): number => direction ? + speed : - speed;
const getRandomBoolean = () => Math.random() >= 0.5

const move = (value: number, speed: number, direction: boolean, maxLimit: number, minLimit: number) => {
    if (value <= minLimit) return { value: value + speed, direction: true }
    if (value >= maxLimit) return { value: value - speed, direction: false }
    return {
        value: value + getCoursePoint(direction, speed),
        direction
    }
}

const getNewVectorPosition = (vector: Vector): Vector => {
    const { x, y, xDirection, yDirection, xSpeed, ySpeed } = vector;
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
});

const getRandomPositionOutReference = (reference: number) => {

    return getRandomBoolean() ? getRandomValue(OUT_TOLERANCE + reference, reference) : getRandomValue(0, -OUT_TOLERANCE)
};

const getRandomVector = (outScreen?: boolean): Vector => ({
    x: outScreen ? getRandomPositionOutReference(window.innerWidth) : getRandomValue(window.innerWidth),
    y: outScreen ? getRandomPositionOutReference(window.innerHeight) : getRandomValue(window.innerHeight),
    xDirection: getRandomBoolean(),
    yDirection: getRandomBoolean(),
    xSpeed: getRandomValue(MAX_SPEED),
    ySpeed: getRandomValue(MAX_SPEED),
})

const draw = (context: any, curves: Array<any>, mousePosition: any) => {
    context.clearRect(-OUT_TOLERANCE, -OUT_TOLERANCE, window.innerWidth + OUT_TOLERANCE, window.innerHeight + OUT_TOLERANCE);
    return curves.map((curve) => {
        const { start, control, end, size, speed, colors } = curve;
        const gradient = context.createLinearGradient(mousePosition.x, mousePosition.y, end.x, end.y);
        context.restore();
        context.beginPath()
        Object.assign(context, {
            fillStyle: gradient,
            strokeStyle: gradient,
            lineWidth: size,
        })
        gradient.addColorStop(0, 'black')
        gradient.addColorStop(0.3, colors[0])
        gradient.addColorStop(0.5, colors[1])
        gradient.addColorStop(0.7, colors[2])
        gradient.addColorStop(1, 'black')
        context.moveTo(start.x, start.y);
        context.quadraticCurveTo(control.x, control.y, end.x, end.y);
        context.stroke()
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
    const curves = new Array(CURVES_AMOUNT)
        .fill({})
        .map(() => ({
            start: getRandomVector(true),
            control: getRandomVector(),
            end: getRandomVector(true),
            size: getRandomValue(MAX_CURVE_SIZE, MIN_CURVE_SIZE),
            colors: new Array(CURVE_COLORS_AMOUNT)
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
    const startAnimation = () => {
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
    React.useEffect(startAnimation, [context]);
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