import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomerService } from './customer.service';
import { ICustomer } from '../models/customer.models';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html'
})
export class UpdateCustomerComponent implements OnInit {
  isSaving = false;

  myForm = this.fb.group({
    id: [0],
    businessName: ['', [Validators.required]],
    brandName: [''],
    cuit: ['', [Validators.maxLength(11)]],
    address: [''],
    phone1: ['', [Validators.required, Validators.maxLength(50)]],
    phone2: ['', [Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    active: [false],
  });

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.customerService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) =>  this.updateForm(res.body?.data)
      );
    }
  }

  updateForm(customer: ICustomer): void {
    this.myForm.patchValue({
      id: customer.id,
      businessName: customer.businessName,
      brandName: customer.brandName,
      cuit: customer.cuit,
      address: customer.address,
      phone1: customer.phone1,
      phone2: customer.phone2,
      email: customer.email,
      active: customer.active,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.createFromForm();
    if (customer.id) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  private createFromForm(): ICustomer {
    return {
      id: this.myForm.get(['id'])!.value,
      businessName: this.myForm.get(['businessName'])!.value,
      brandName: this.myForm.get(['brandName'])!.value,
      cuit: this.myForm.get(['cuit'])!.value,
      address: this.myForm.get(['address'])!.value,
      phone1: this.myForm.get(['phone1'])!.value,
      phone2: this.myForm.get(['phone2'])!.value,
      email: this.myForm.get(['email'])!.value,
      active: this.myForm.get(['active'])!.value,
    };
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => this.previousState(),
      () => this.isSaving = false
    );
  }
}
