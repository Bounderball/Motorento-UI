export interface IWorkingCar { // This interface represents an instance of a car with all relevant details needed for viewing in the catalog
                               // (originally withdrawn from several different tables)
    id: number
    mileage: number;
    pic: string;
    licensePlateNumber: number;
    manufacturer: string;
    modelName: string;
    dailyPrice: number;
    delayPricePerDay: number;
    manufactureYear: Date;
    gear: boolean;
    address: string;
    branchName: string;

}