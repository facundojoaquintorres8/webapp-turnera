import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { IListItem } from "src/app/models/list.models";

export interface IInput {
  label: string;
  required?: boolean;
  tooltip?: string;

  name: string;
  type: InputTypeEnum;
  itemList?: IListItem[];
  width: number;
  minDate?: NgbDateStruct;
  maxDate?: NgbDateStruct;
  onSearch?: (param?: any) => void;
}

export enum InputTypeEnum {
  TEXT,
  NUMBER,
  BOOLEAN,
  DATE,
  LIST,
  AUTOCOMPLETE
}