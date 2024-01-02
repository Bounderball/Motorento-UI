export interface IHistoryOrder { // This interface represents an instance of an order with all relevant details needed for viewing in the user's order history page
                                 // (originally withdrawn from several different tables)
    id: number;
    startDate: Date;
    endDate: Date;
    manufacturer: string;
    model: string;
    dateReturned: Date;
    totalCost: number;
}