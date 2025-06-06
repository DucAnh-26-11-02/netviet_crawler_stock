import { IDateObject } from 'src/types/util.type';
export declare function createDateObject(date: Date): IDateObject;
export declare function getShiftedDate(obj: IDateObject, daysToShift: number): IDateObject;
export declare function formatDateObject(dateObj: IDateObject, format?: string): string;
