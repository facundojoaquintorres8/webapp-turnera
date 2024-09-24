import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IResource } from '../models/resource.models';
import { ResourceService } from './resource.service';
import { IResponse } from '../models/response.models';
import { TableComponent } from '../component/table/table.component';
import { AppointmentStatusEnum, IAppointment } from '../models/appointment.model';
import { IHeader } from '../component/table/table.models';
import { AppointmentService } from '../appointment-tracking/appointment.service';

@Component({
  selector: 'app-detail-resource',
  templateUrl: './detail-resource.component.html'
})
export class DetailResourceComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;

  resource!: IResource;
  appointments!: IAppointment[];

  headers!: IHeader[];
  sort: string[] = ['DESC', 'startDate'];
  
  appointmentStatusEnum: any = AppointmentStatusEnum;

  constructor(
    private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit(): void {
    this.getDetail();

    this.headers = [
      { label: 'Fecha Inicio', colName: 'startDate', canSort: true },
      { label: 'Fecha Fin', colName: 'endDate', canSort: true },
      { label: 'Cliente', colName: 'customer', canSort: true },
      { label: 'Tipo de Recurso', colName: 'resourceType', canSort: true },
      { label: 'Estado', colName: 'status', canSort: false }
    ];
  }

  getDetail(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.resourceService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) =>  this.resource = res.body?.data
      );
    }
  }

  query = (req?: any) => this.appointmentService.findAllByFilter({ ...req, resourceId: this.resource.id });

  getHistory(): void {
    this.tableComponent.executeQuery({ page: 1 });
  }

  previousState(): void {
    window.history.back();
  }
}
