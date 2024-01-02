export interface IModel { // This interface represents a car model
    id: number;
    manufacturer: string;
    modelName: string;
    dailyPrice: number;
    delayPricePerDay: number;
    manufactureYear: Date;
    gear: boolean;
}