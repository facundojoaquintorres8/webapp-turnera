import { IAppointment } from "./appointment.model";
import { IResource } from "./resource.models";
import { IResourceType } from "./resourceType.models";

export interface IAgenda {
  id: number;
  resource: IResource;
  startDate: Date;
  endDate: Date;
  lastAppointment: IAppointment;
}

export interface ISaveAgenda {
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

export enum RepeatTypeEnum {
  DAILY = 'Día',
  WEEKLY = 'Semana',
  MONTHLY = 'Mes'
}
