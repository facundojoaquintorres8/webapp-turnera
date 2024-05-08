import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IResourceType } from '../models/resourceType.models';
import { ResourceTypeService } from './resource-type.service';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-detail-resource-type',
  templateUrl: './detail-resource-type.component.html'
})
export class DetailResourceTypeComponent implements OnInit {
  resourceType!: IResourceType;

  constructor(
    private resourceTypeService: ResourceTypeService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.resourceTypeService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) =>  this.resourceType = res.body?.data
      );
    }
  }

  previousState(): void {
    window.history.back();
  }
}
