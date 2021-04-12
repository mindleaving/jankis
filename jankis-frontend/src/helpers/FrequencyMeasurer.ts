export default class FrequencyMeasurer {
    
    timestamps: Date[];
    maxAge: number;

    constructor(maxAge: number) {
        this.timestamps = [];
        this.maxAge = maxAge;
    }

    update = () => {
        const now = new Date();
        this.timestamps.filter(x => x > now - maxAge);
        this.timestamps.push(now);
    }

    isFrequencyAvailable = () => {
        return this.timestamps.length >= 2;
    }

    getFrequency = () => {
        if(this.timestamps.length < 2) {
            throw new Error('Not enough data for measuring frequency');
        }
        const deltaT = (this.timestamps[this.timestamps.length-1] - this.timestamps[0]) / (this.timestamps.length - 1);
        const frequency = 60 / deltaT;
        return frequency;
    }
}