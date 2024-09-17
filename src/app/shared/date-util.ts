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

export function addTimeToNgbDateStruct(date: NgbDateStruct, value: number, type: DurationInputArg2): NgbDateStruct {
    const result = moment(formatDateFromNgbDateStruct(date)).add(value, type);
    return { day: result.date(), month: result.month() + 1, year: result.year() };
}
