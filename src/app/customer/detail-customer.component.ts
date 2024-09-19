import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICustomer } from '../models/customer.models';
import { CustomerService } from './customer.service';
import { IResponse } from '../models/response.models';
import { AppointmentStatusEnum, IAppointment } from '../models/appointment.model';
import { AppointmentService } from '../appointment-tracking/appointment.service';
import { IHeader } from '../component/table/table.models';
import { TableComponent } from '../component/table/table.component';

@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html'
})
export class DetailCustomerComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;

  customer!: ICustomer;
  appointments!: IAppointment[];

  headers!: IHeader[];
  sort: string[] = ['DESC', 'startDate'];
  
  appointmentStatusEnum: any = AppointmentStatusEnum;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit(): void {
    this.getDetail();

    this.headers = [
      { label: 'Fecha Inicio', colName: 'startDate', canSort: true },
      { label: 'Fecha Fin', colName: 'endDate', canSort: true },
      { label: 'Recurso', colName: 'resource', canSort: true },
      { label: 'Tipo de Recurso', colName: 'resourceType', canSort: true },
      { label: 'Estado', colName: 'status', canSort: false }
    ];
  }

  getDetail(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.customerService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) =>  this.customer = res.body?.data
      );
    }
  }

  query = (req?: any) => this.appointmentService.findAllByFilter({ ...req, customerId: this.customer.id });

  getHistory(): void {
    this.tableComponent.executeQuery({ page: 1 });
  }

  previousState(): void {
    window.history.back();
  }
}
