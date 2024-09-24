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


export interface PermissionByEntity2 { // TODO: ver con editar si unifico
  id: string;
  name: string;
  actions: IPermissionAccion[];
}

export interface IPermissionAccion {
  name: string;
  order: number;
}

export interface PermissionByEntity {
  name: string;
  actions: {
    permission: IPermission;
    action: string;
  }[];
  selected: boolean;
}
