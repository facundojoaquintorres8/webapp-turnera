import { IAgenda } from './agenda.models';
import { ICustomer, IQuickCustomer } from './customer.models';
import { IListItem } from './list.models';

export interface IAppointment {
    id: number;
    customerBusinessName: string;
    customer: ICustomer;
    appointmentStatus: IAppointmentStatus[];
    lastAppointmentStatus: IAppointmentStatus;
}

export interface IAppointmentSave {
    customer: IQuickCustomer;
    agenda: IAgenda;
}

export interface IAppointmentChangeStatus {
    id: number;
    observations: string;
}

export interface IAppointmentStatus {
    id: number;
    observations: string;
    status: AppointmentStatusEnum;
    createdDate: string;
}

export enum AppointmentStatusEnum {
    FREE = 'Libre',
    BOOKED = 'Reservado',
    ABSENT = 'Ausente',
    CANCELLED = 'Cancelado',
    IN_ATTENTION = 'En Atención',
    FINALIZED = 'Finalizado',
}

export const AppointmentStatusToListItem: IListItem[] = Object.entries(AppointmentStatusEnum).map(([id, value]) => ({ id, value }));