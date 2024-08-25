export interface IProfile {
  id: number;
  active: boolean;
  description: string;
  permissions: IPermission[];
  selected?: boolean;
}

export interface IPermission {
  id: number;
  description: string;
  code: string;
  selected?: boolean;
}

export interface PermissionByEntity {
  name: string;
  actions: {
    permission: IPermission;
    action: string;
  }[];
  selected: boolean;
}