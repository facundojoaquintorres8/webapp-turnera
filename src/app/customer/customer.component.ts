import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCustomerModalComponent } from './delete-customer-modal.component';
import { CustomerService } from './customer.service';
import { ICustomer } from '../models/customer.models';
import { FormBuilder } from '@angular/forms';
import { IHeader } from '../component/table/table.models';
import { TableComponent } from '../component/table/table.component';
import { IInput, InputTypeEnum } from '../component/filter/filter.models';
import { getListToBoolean } from '../shared/generic-util';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;  
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'businessName'];

  filterInputs!: IInput[];

  myForm = this.fb.group({
    businessName: [null],
    brandName: [null],
    email: [null],
    phone1: [null],
    active: [null],
  });

  constructor(
    private customerService: CustomerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.filterInputs = [
      { label: 'Razón Social', type: InputTypeEnum.TEXT, name: 'businessName', width: 4 },
      { label: 'Marca', type: InputTypeEnum.TEXT, name: 'brandName', width: 4 },
      { label: 'Correo Electrónico', type: InputTypeEnum.TEXT, name: 'email', width: 4 },
      { label: 'Teléfono 1', type: InputTypeEnum.TEXT, name: 'phone1', width: 4 },
      { label: 'Activos', type: InputTypeEnum.LIST, name: 'active', width: 2, itemList: getListToBoolean() },
    ];

    this.headers = [
      { label: 'Razón Social', colName: 'businessName', canSort: true },
      { label: 'Marca', colName: 'brandName', canSort: true },
      { label: 'Correo Electrónico', colName: 'email', canSort: true },
      { label: 'Teléfono 1', colName: 'phone1', canSort: true },
      { label: 'Activo', colName: 'active', canSort: true }
    ];
  }

  query = (req?: any) => this.customerService.findAllByFilter(req);

  getItems(): void {
    this.tableComponent.executeQuery({ page: 1 });
  }

  clear(): void {
    this.myForm.reset();
    this.tableComponent.executeQuery({ page: 1 });
  }

  delete(customer: ICustomer): void {
    this.ngbModalRef = this.modalService.open(DeleteCustomerModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.customer = customer;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }
}
