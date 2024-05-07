export interface IHoliday {
  id: number;
  active: boolean;
  date: Date;
  description: string;
  useInAgenda: boolean;
}

export interface ISaveHoliday {
  id: number;
  active: boolean;
  date: string;
  description: string;
  useInAgenda: boolean;
}
