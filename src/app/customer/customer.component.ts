import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteCustomerModalComponent } from './delete-customer-modal.component';
import { CustomerService } from './customer.service';
import { ICustomer } from '../models/customer.models';
import { UntypedFormBuilder } from '@angular/forms';
import { IHeader, InputTypeEnum } from '../component/table/table.models';
import { TableComponent } from '../component/table/table.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;  
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'businessName'];
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
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.headers = [
      { label: 'Razón Social', inputType: InputTypeEnum.TEXT, inputName: 'businessName', sort: true },
      { label: 'Marca', inputType: InputTypeEnum.TEXT, inputName: 'brandName', sort: true },
      { label: 'Correo Electrónico', inputType: InputTypeEnum.TEXT, inputName: 'email', sort: true },
      { label: 'Teléfono 1', inputType: InputTypeEnum.TEXT, inputName: 'phone1', sort: true },
      { label: 'Activo', inputType: InputTypeEnum.BOOLEAN, inputName: 'active', sort: false }
    ];
  }

  query = (req?: any) => this.customerService.findAllByFilter(req);

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
