"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDateObject = createDateObject;
exports.getShiftedDate = getShiftedDate;
exports.formatDateObject = formatDateObject;
function createDateObject(date) {
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
    };
}
function getShiftedDate(obj, daysToShift) {
    const baseDate = new Date(obj.year, obj.month - 1, obj.date);
    baseDate.setDate(baseDate.getDate() + daysToShift);
    return {
        year: baseDate.getFullYear(),
        month: baseDate.getMonth() + 1,
        date: baseDate.getDate(),
    };
}
function formatDateObject(dateObj, format = 'YYYY-MM-DD') {
    const { year, month, date } = dateObj;
    const paddedMonth = String(month).padStart(2, '0');
    const paddedDate = String(date).padStart(2, '0');
    return format
        .replace(/YYYY/g, year.toString())
        .replace(/MM/g, paddedMonth)
        .replace(/DD/g, paddedDate);
}
//# sourceMappingURL=time.js.map