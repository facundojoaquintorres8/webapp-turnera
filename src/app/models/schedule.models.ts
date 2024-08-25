import { CalendarEvent } from "angular-calendar";
import { AppointmentStatusEnum } from "./appointment.model";
import { IAgenda } from "./agenda.models";

export enum CalendarViewEnum {
    MONTH,
    WEEK,
    DAY
}

export interface ICalendarEvent extends CalendarEvent {
    agenda: IAgenda;
    lastAppointmentStatus: AppointmentStatusEnum;
}