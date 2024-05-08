import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IOrganization } from '../models/organization.models';
import { OrganizationService } from './organization.service';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-detail-organization',
  templateUrl: './detail-organization.component.html'
})
export class DetailOrganizationComponent implements OnInit {
  organization!: IOrganization;

  constructor(
    private organizationService: OrganizationService,
  ) { }

  ngOnInit(): void {
    this.organizationService.find().subscribe(
      (res: HttpResponse<IResponse>) => this.organization = res.body?.data
    );
  }

  previousState(): void {
    window.history.back();
  }
}
