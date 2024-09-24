import { NgbInputDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { IListItem } from "../models/list.models";
import { Injectable, Pipe, PipeTransform } from "@angular/core";

export function getListToBoolean(): IListItem[] {
    return [
        { id: '', value: 'Todos' },
        { id: 'true', value: 'Si' },
        { id: 'false', value: 'No' }
    ];
}

@Injectable({ providedIn: 'root' })
export class CustomDatePickerConfig extends NgbInputDatepickerConfig {
    firstDayOfWeek = 7;
}

export function translateEntityFromPermission(value: string): string {
    let result = '';
    switch (value) {
        case 'users':
            result = 'Usuarios'
            break;
        case 'profiles':
            result = 'Perfiles'
            break;
        case 'organizations':
            result = 'Mi Organización'
            break;
        case 'customers':
            result = 'Clientes'
            break;
        case 'resourcesTypes':
            result = 'Tipos de Recursos'
            break;
        case 'resources':
            result = 'Recursos'
            break;
        case 'agendas':
            result = 'Disponibilidades'
            break;
        case 'appointments':
            result = 'Turnos'
            break;
        case 'holidays':
            result = 'Feriados'
            break;
    }
    return result;
}

export function getPermissionActionOrder(value: string): number {
    let result = -1;
    switch (value) {
        case 'read':
            result = 0;
            break;
        case 'write':
            result = 1;
            break;
        case 'delete':
            result = 2;
            break;
        case 'book':
            result = 3;
            break;
        case 'absent':
            result = 4;
            break;
        case 'cancel':
            result = 5;
            break;
        case 'attend':
            result = 6;
            break;
        case 'finalize':
            result = 7;
            break;
        default:
            break;
    }
    return result;
}

@Pipe({
    name: "orderBy"
})
export class OrderByPipe implements PipeTransform {
    transform(array: any, field: string): any[] | undefined {
        if (!Array.isArray(array)) {
          return;
        }
        array.sort((a: any, b: any) => {
          if (a[field] < b[field]) {
            return -1;
          } else if (a[field] > b[field]) {
            return 1;
          } else {
            return 0;
          }
        });
        return array;
      }
}