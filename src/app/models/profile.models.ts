export interface IProfile {
  id: number;
  active: boolean;
  description: string;
  permissions: IPermission[];
}

export interface IPermission {
  id: number;
  description: string;
  code: string;
}

export interface PermissionByEntity {
  name: string;
  actions: {
    permission: IPermission;
    action: string;
  }[];
  selected: boolean;
}