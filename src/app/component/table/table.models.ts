import { IListItem } from "src/app/models/list.models";
  // TODO: borrar no va más



export interface IHeader {
  label: string;
  sort: boolean;

  // TODO: borrar no va más
  inputName: string;
  inputType: InputTypeEnum;
  itemList?: IListItem[];
}

  // TODO: borrar no va más
export enum InputTypeEnum {
  TEXT,
  NUMBER,
  BOOLEAN,
  DATE,
  LIST,
  AUTOCOMPLETE
}