export default class FrequencyMeasurer {
    
    timestamps: Date[];
    maxAge: number;

    constructor(maxAge: number) {
        this.timestamps = [];
        this.maxAge = maxAge;
    }

    update = () => {
        const now = new Date();
        this.timestamps.filter(x => now.getTime() - x.getTime() > this.maxAge);
        this.timestamps.push(now);
    }

    isFrequencyAvailable = () => {
        return this.timestamps.length >= 2;
    }

    getFrequency = () => {
        if(this.timestamps.length < 2) {
            throw new Error('Not enough data for measuring frequency');
        }
        const deltaTinMilliseconds = Math.abs(this.timestamps[this.timestamps.length-1].getTime() - this.timestamps[0].getTime()) / (this.timestamps.length - 1);
        const frequency = 60*1000 / deltaTinMilliseconds;
        return frequency;
    }
}