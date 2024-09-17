import { NgbInputDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { IListItem } from "../models/list.models";
import { Injectable } from "@angular/core";

export function getListToBoolean(): IListItem[] {
    return [
        { id: '', value: 'Todos' },
        { id: 'true', value: 'Si' },
        { id: 'false', value: 'No' }
    ];
}

@Injectable({ providedIn: 'root' })
export class CustomDatePickerConfig extends NgbInputDatepickerConfig  {
    firstDayOfWeek = 7;
}