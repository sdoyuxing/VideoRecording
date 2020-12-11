export class Transition {
    private requestAnimationFrame: Function
    private render: Function
    private running: boolean = true
    private intervalTime: number
    private startTime: number
    private interval: number

    constructor(render: Function = () => { }, intervalTime?: number) {

        this.requestAnimationFrame = typeof window !== 'undefined' && (window.requestAnimationFrame && window.requestAnimationFrame.bind(window)) || function (func) {
            return setTimeout(func, 16);
        };
        this.intervalTime = intervalTime
        this.render = render
    }

    public start(): void {
        this.requestAnimationFrame((timestamp) => {
            this.step(timestamp)
        });
    }
    private step(timestamp: number): void {
        if (this.startTime === undefined) this.startTime = timestamp
        this.interval = timestamp - this.startTime;
        if (this.intervalTime === undefined || this.interval > this.intervalTime) {
            this.render();
            this.startTime = timestamp;
        }
        if (this.running)
            this.requestAnimationFrame((timestamp) => {
                this.step(timestamp)
            });
    }
    public stop(): void {
        this.running = false;
    }
    public setIntervalTime(intervalTime: number = 0): void {
        this.intervalTime = intervalTime;
    }
    public getIntervalTime():number {
        return this.intervalTime;
    }
    public setRender(render: Function = () => { }): void {
        this.render = render;
    }
    public getRender(render: Function = () => { }):Object {
        return this.render;
    }
}
