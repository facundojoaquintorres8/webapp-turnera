import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPermission, IProfile, PermissionByEntity2 } from '../models/profile.models';
import { ProfileService } from './profile.service';
import { IResponse } from '../models/response.models';
import { getPermissionActionOrder, translateEntityFromPermission } from '../shared/generic-util';

@Component({
  selector: 'app-detail-profile',
  templateUrl: './detail-profile.component.html',
  styleUrls: ['./profile.scss']
})
export class DetailProfileComponent implements OnInit {
  profile!: IProfile;
  allPermissions: IPermission[] = [];
  permissionsByEntities: PermissionByEntity2[] = [];

  constructor(
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.profileService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) => {
          this.profile = res.body?.data;
          this.updateForm(this.profile);
        }
      );
    }
  }

  private updateForm(profile: IProfile): void {
    this.allPermissions = profile.permissions.filter((x: IPermission) => x.code !== 'home.index') || [];

    this.allPermissions.forEach(p => {
      const permissionSplit = p.code.split('.');
      const entity = permissionSplit[0];
      const action = permissionSplit[1];
      const actionObject = { name: permissionSplit[1], order: getPermissionActionOrder(action) };
      const permissionExisting = this.permissionsByEntities.find(x => x.id === entity);
      if (permissionExisting) {
        permissionExisting.actions.push(actionObject);
      } else {
        this.permissionsByEntities.push({
          id: entity, name: translateEntityFromPermission(entity), actions: [actionObject]
        });
      }
    });

  }

  previousState(): void {
    window.history.back();
  }
}
