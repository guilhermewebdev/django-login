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

const movePoint = (point: Point, maxLimit: number, minLimit: number): Point => {
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
    x: movePoint(x, window.innerWidth + OUT_TOLERANCE, -OUT_TOLERANCE),
    y: movePoint(y, window.innerHeight + OUT_TOLERANCE, -OUT_TOLERANCE),
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

class Curve {
    start: Vector;
    control: Vector;
    end: Vector;
    size: number;
    colors: Array<string>;

    constructor(start: Vector, control: Vector, end: Vector, size: number, colors: Array<string>) {
        this.start = start
        this.control = control
        this.end = end
        this.size = size
        this.colors = colors
    }

    createGradient(context: CanvasRenderingContext2D, mousePosition: { x: number, y: number }) {
        const gradient = context.createLinearGradient(mousePosition.x, mousePosition.y, this.end.x.position, this.end.y.position);
        gradient.addColorStop(0, 'black')
        gradient.addColorStop(0.3, this.colors[0])
        gradient.addColorStop(0.5, this.colors[1])
        gradient.addColorStop(0.7, this.colors[2])
        gradient.addColorStop(1, 'black')
        Object.assign(context, {
            fillStyle: gradient,
            strokeStyle: gradient,
            lineWidth: this.size,
        })
    }

    move() {
        this.start = getNewVectorPosition(this.start);
        this.control = getNewVectorPosition(this.control);
        this.end = getNewVectorPosition(this.end)
    }

    draw(context: CanvasRenderingContext2D) {
        context.restore();
        context.beginPath()
        context.moveTo(this.start.x.position, this.start.y.position);
        context.quadraticCurveTo(this.control.x.position, this.control.y.position, this.end.x.position, this.end.y.position);
        context.stroke()
    }

}

const draw = (context: CanvasRenderingContext2D, curves: Array<Curve>, mousePosition: { x: number, y: number }) => {
    context.clearRect(-OUT_TOLERANCE, -OUT_TOLERANCE, window.innerWidth + OUT_TOLERANCE, window.innerHeight + OUT_TOLERANCE);
    return curves.map((curve) => {
        curve.createGradient(context, mousePosition)
        curve.draw(context);
        curve.move();
        return curve;
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
        .map(() => new Curve(
            getRandomVector(true),
            getRandomVector(),
            getRandomVector(true),
            getRandomValue(MAX_CURVE_SIZE, MIN_CURVE_SIZE),
            new Array(CURVE_COLORS_AMOUNT)
                .fill('')
                .map(getRandomColor)
        ))
    const updateScreenSize = () => setScreenSize(getScreenSize())
    const keepMaxScreenSize = () => {
        window.addEventListener('resize', updateScreenSize)
        updateScreenSize()
        return () => window.removeEventListener('resize', updateScreenSize);
    }
    const startAnimation = () => {
        if (context) {
            const render = (cvs: Array<Curve>): number => {
                const newCvs: Array<Curve> = draw(context, cvs, mouse.current);
                return requestAnimationFrame(() => render(newCvs))
            }
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