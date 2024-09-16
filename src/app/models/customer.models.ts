
export interface ICustomer {
  id: number;
  active: boolean;
  businessName: string;
  brandName?: string;
  cuit?: string;
  email: string;
  phone1: string;
  phone2?: string;
  address?: string;
  fullName?: string; // businessName + cuit
}

export interface IQuickCustomer {
  id?: number;
  businessName: string;
  email: string;
  phone1: string;
}

