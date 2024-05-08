import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPermission, IProfile, PermissionByEntity } from '../models/profile.models';
import { ProfileService } from './profile.service';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-detail-profile',
  templateUrl: './detail-profile.component.html',
  styleUrls: ['./profile.scss']
})
export class DetailProfileComponent implements OnInit {
  profile!: IProfile;
  allPermissions: IPermission[] = [];
  permissionsByEntities: PermissionByEntity[] = [];

  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {

      this.profileService.findAllPermissions().subscribe(
        (res1: HttpResponse<IResponse>) => {
          this.allPermissions = res1.body?.data.filter((x: IPermission) => x.code !== 'home.index') || [];
  
          this.allPermissions.forEach(permission => {
            const permissionSplit = permission.code.split('.');
            const permissionExisting = this.permissionsByEntities.find(x => x.name === permissionSplit[0]);
            if (permissionExisting) {
              permissionExisting.actions.push({ permission, action: permissionSplit[1] });
            } else {
              this.permissionsByEntities.push({
                name: permissionSplit[0], actions: [{ permission, action: permissionSplit[1] }], selected: false
              });
            }
          });
  
          this.profileService.find(parseInt(id)).subscribe(
            (res2: HttpResponse<IResponse>) => {
              this.profile = res2.body?.data;
              this.updateForm(res2.body?.data, this.permissionsByEntities);
            }
          );
        }
      )
    }
  }

  private updateForm(profile: IProfile, permissionsByEntities: PermissionByEntity[]): void {
    permissionsByEntities.forEach(pbye => {
      pbye.actions.forEach(action => {
        if (profile.permissions.find(x => x.id === action.permission.id)) {
          this.select(action.permission, pbye);
        }
      });
    });
  }

  private select(permission: IPermission, permissionByEntity: PermissionByEntity): void {
    permission['selected'] = !permission['selected'];
    permissionByEntity.selected = permissionByEntity.actions.every((x: any) => {
      return x.permission['selected'];
    });
  }

  previousState(): void {
    window.history.back();
  }
}
