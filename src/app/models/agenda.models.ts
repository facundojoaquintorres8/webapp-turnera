import { IAppointment } from "./appointment.model";
import { IListItem } from "./list.models";
import { IResource } from "./resource.models";
import { IResourceType } from "./resourceType.models";

export interface IAgenda {
  id: number;
  resource: IResource;
  resourceType: IResourceType;
  startDate: Date;
  endDate: Date;
  lastAppointment: IAppointment;
  active: boolean;
}

export interface ICreateAgenda {
  id: number;
  resource: IResource;
  resourceType: IResourceType;
  startDate: string;
  startHour: string;
  endHour: string;
  zoneId: string;
  segmented: boolean;
  duration: number;
  repeat: boolean;
  repeatType: RepeatTypeEnum;
  finalize: string;
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  omitHolidays: boolean;
}

export interface IUpdateAgenda {
  id: number;
  resource: IResource;
  resourceType: IResourceType;
  startDate: string;
  startHour: string;
  endHour: string;
  endDate: string;
  zoneId: string;
  active: boolean;
}

export enum RepeatTypeEnum {
  DAILY = 'Día',
  WEEKLY = 'Semana',
  MONTHLY = 'Mes'
}

export const RepeatTypeToListItem: IListItem[] = Object.entries(RepeatTypeEnum).map(([id, value]) => ({ id, value }));