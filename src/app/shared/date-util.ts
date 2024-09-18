import { NgbDateStruct, NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import moment, { DurationInputArg2 } from "moment";

export function formatDateFromNgbDateStruct(date: NgbDateStruct): string | null {
    if (!date) {
        return null;
    }
    return date.year + '-' + formatNumberToTwoDigits(date.month) + '-'
        + formatNumberToTwoDigits(date.day);
}

export function formatDateFromDate(date: Date): string | null  {
    if (!date) {
        return null;
    }
    return date.getFullYear() + '-' + formatNumberToTwoDigits(date.getMonth() + 1) + '-'
        + formatNumberToTwoDigits(date.getDate());
}

export function formatTimeFromNgbTimeStruct(time: NgbTimeStruct): string | null  {
    if (!time) {
        return null;
    }
    return formatNumberToTwoDigits(time.hour) + ':'
        + formatNumberToTwoDigits(time.minute) + ':' + formatNumberToTwoDigits(time.second);
}

function formatNumberToTwoDigits(x: number): string {
    return ("00" + x).slice(-2);
}

export function formatNgbDateStructFromDate(date: Date): NgbDateStruct | null {
    if (!date) {
        return null;
    }
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

export function formatNgbTimeStructFromDate(date: Date): NgbTimeStruct | null {
    if (!date) {
        return null;
    }
    return { hour: date.getHours(), minute: date.getMinutes(), second: 0 };
}

export function addTimeToNgbDateStruct(date: NgbDateStruct, value: number, type: DurationInputArg2): NgbDateStruct {
    const result = moment(formatDateFromNgbDateStruct(date)).add(value, type);
    return { day: result.date(), month: result.month() + 1, year: result.year() };
}

export function compareEqualDates(a: NgbDateStruct, b: NgbDateStruct): boolean {
    if (a && b && a.year === b.year && a.month === b.month && a.day === b.day) {
        return true;
    }
    return false;
}

export function compareEqualOrGreaterTimes(a: NgbTimeStruct, b: NgbTimeStruct): boolean {
    if (a && b) {
        const equals: boolean = a.hour === b.hour && a.minute === b.minute && a.second === b.second;
        const hourBiggerThan: boolean = a.hour > b.hour;
        const minuteBiggerThan: boolean = a.hour === b.hour && a.minute > b.minute;
        const secondBiggerThan: boolean = a.hour === b.hour && a.minute === b.minute && a.second > b.second;
        if (equals || hourBiggerThan || minuteBiggerThan || secondBiggerThan) {
            return true;
        }
    }
    return false;
}
