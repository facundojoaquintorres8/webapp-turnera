import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IAgenda } from '../models/agenda.models';
import { AppointmentService } from './appointment.service';
import { CustomerService } from '../customer/customer.service';
import { ICustomer, IQuickCustomer } from '../models/customer.models';
import { IAppointmentSave } from '../models/appointment.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-book-appointment-modal',
  templateUrl: './book-appointment-modal.component.html'
})
export class BookAppointmentComponent implements OnInit {
  isSaving = false;
  agenda!: IAgenda;

  customers: ICustomer[] = [];
  showSelectCustomers: boolean = true;

  myForm = this.fb.group({
    customer: [null, [Validators.required]],
    businessName: [null],
    phone1: [null],
    email: [null],
  });

  constructor(
    private appointmentService: AppointmentService,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.customerService.findAllByFilter({ active: true }).subscribe(
      (res: HttpResponse<IResponse>) => {
        this.customers = res.body?.data.content.map(
          (c: ICustomer) => {
            c.fullName = `${c.businessName} ${c.cuit ? c.cuit: ''}`
            return c;
          }
        ) || [];
      }
    )
  }

  newCustomer(): void {
    this.myForm.controls['customer'].clearValidators();
    this.myForm.controls['businessName'].setValidators([Validators.required]);
    this.myForm.controls['phone1'].setValidators([Validators.required, Validators.maxLength(50)]);
    this.myForm.controls['email'].setValidators([Validators.required, Validators.email, Validators.maxLength(100)]);
    this.myForm.reset();
    this.showSelectCustomers = false;
  }

  cancelNewCustomer(): void {
    this.myForm.controls['businessName'].clearValidators();
    this.myForm.controls['phone1'].clearValidators();
    this.myForm.controls['email'].clearValidators();
    this.myForm.controls['customer'].setValidators([Validators.required]);
    this.myForm.reset();
    this.showSelectCustomers = true;
  }

  save(): void {
    this.isSaving = true;
    const appointment = this.createFromForm();
    this.subscribeToSaveResponse(this.appointmentService.book(appointment));
  }

  private createFromForm(): IAppointmentSave {
    return {
      agenda: this.agenda,
      customer: this.getCustomer(),
    };
  }

  private getCustomer(): IQuickCustomer {
    if (this.showSelectCustomers) {
      return this.myForm.get(['customer'])!.value;
    } else {
      return {
        businessName: this.myForm.get(['businessName'])!.value,
        phone1: this.myForm.get(['phone1'])!.value,
        email: this.myForm.get(['email'])!.value,
      }
    }
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => this.activeModal.close(),
      () => this.isSaving = false
    );
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
