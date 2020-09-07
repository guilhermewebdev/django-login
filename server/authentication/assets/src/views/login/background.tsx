import * as React from 'react';
import useMouseMove from './mouseHook';

type Point = {
    position: number
    direction: boolean,
    speed: number,
}

type Vector = {
    x: Point,
    y: Point,
}

type Curve = {
    start: Vector,
    control: Vector,
    end: Vector,
    size: number,
    colors: Array<String>,
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

const move = (point: Point, maxLimit: number, minLimit: number): Point => {
    const { position, speed, direction } = point;
    if (position <= minLimit) return { position: position + speed, direction: true, speed }
    if (position >= maxLimit) return { position: position - speed, direction: false, speed }
    return {
        position: position + getCoursePoint(direction, speed),
        direction,
        speed
    }
}

const getNewVectorPosition = ({ x, y }: Vector): Vector => ({
    x: move(x, window.innerWidth + OUT_TOLERANCE, -OUT_TOLERANCE),
    y: move(y, window.innerHeight + OUT_TOLERANCE, -OUT_TOLERANCE),
})

const getScreenSize = () => ({
    height: window.innerHeight,
    width: window.innerWidth
});

const getRandomPositionOutReference = (reference: number) => {
    return getRandomBoolean() ? getRandomValue(OUT_TOLERANCE + reference, reference) : getRandomValue(0, -OUT_TOLERANCE)
};

const getRandomPoint = (outScreen?: boolean): Point => ({
    position: outScreen ? getRandomPositionOutReference(window.innerWidth) : getRandomValue(window.innerWidth),
    direction: getRandomBoolean(),
    speed: getRandomValue(MAX_SPEED),
})

const getRandomVector = (outScreen?: boolean): Vector => ({
    x: getRandomPoint(outScreen),
    y: getRandomPoint(outScreen)
})

const draw = (context: any, curves: Array<Curve>, mousePosition: { x: number, y: number }) => {
    context.clearRect(-OUT_TOLERANCE, -OUT_TOLERANCE, window.innerWidth + OUT_TOLERANCE, window.innerHeight + OUT_TOLERANCE);
    return curves.map((curve) => {
        const { start, control, end, size, colors } = curve;
        const gradient = context.createLinearGradient(mousePosition.x, mousePosition.y, end.x.position, end.y.position);
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
        context.moveTo(start.x.position, start.y.position);
        context.quadraticCurveTo(control.x.position, control.y.position, end.x.position, end.y.position);
        context.stroke()
        return {
            size,
            start: getNewVectorPosition(start),
            control: getNewVectorPosition(control),
            end: getNewVectorPosition(end),
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
    const curves: Array<Curve> = new Array(CURVES_AMOUNT)
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
    const render = (cvs: Array<Curve>): number => {
        const newCvs: Array<Curve> = draw(context, cvs, mouse.current);
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