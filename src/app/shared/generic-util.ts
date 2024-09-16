import { IListItem } from "../models/list.models";

export function getListToBoolean(): IListItem[] {
    return [
        { id: '', value: 'Todos'},
        { id: 'true', value: 'Si'},
        { id: 'false', value: 'No'}
    ];
}