import { IResourceType } from "./resourceType.models";

export interface IResource {
  id: number;
  active: boolean;
  description: string;
  code?: string;
  resourceType: IResourceType;
  resourceTypeDescription?: string;
}