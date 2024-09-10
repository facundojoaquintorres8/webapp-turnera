import { IListItem } from "src/app/models/list.models";

export interface IHeader {
  label: string;
  inputName: string;
  inputType: InputTypeEnum;
  sort: boolean;
  querySelector?: (param?: any) => any;
  itemList?: IListItem[];
}

export enum InputTypeEnum {
  TEXT,
  NUMBER,
  BOOLEAN,
  DATE,
  LIST,
  AUTOCOMPLETE
}