import { IDateObject } from 'src/types/util.type';

export function createDateObject(date: Date): IDateObject {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
  };
}

export function getShiftedDate(obj: IDateObject, daysToShift: number): IDateObject {
  const baseDate = new Date(obj.year, obj.month - 1, obj.date);
  baseDate.setDate(baseDate.getDate() + daysToShift);

  return {
    year: baseDate.getFullYear(),
    month: baseDate.getMonth() + 1,
    date: baseDate.getDate(),
  };
}

export function formatDateObject(dateObj: IDateObject, format = 'YYYY-MM-DD'): string {
  const { year, month, date } = dateObj;

  const paddedMonth = String(month).padStart(2, '0');
  const paddedDate = String(date).padStart(2, '0');

  return format
    .replace(/YYYY/g, year.toString())
    .replace(/MM/g, paddedMonth)
    .replace(/DD/g, paddedDate);
}
