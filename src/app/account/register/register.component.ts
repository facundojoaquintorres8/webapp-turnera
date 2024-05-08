import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/component/toast/toast.service';
import { IRegister } from 'src/app/models/account.models';
import { AccountService } from '../account.service';
import { IResponse } from 'src/app/models/response.models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  isSaving = false;

  myForm = this.fb.group({
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    username: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
    businessName: [null, [Validators.required]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {}

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.accountService.register(this.createFromForm()));
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => {
        this.toastService.changeMessage(
          {
            showSuccessToast: true,
            successMessage: 'Su Organización ha sido creada con éxito. Revise su Correo Electrónico para activar la misma.'
          }
        );
        this.router.navigate(['/']);
      },
      () => this.isSaving = false
    );
  }

  private createFromForm(): IRegister {
    return {
      firstName: this.myForm.get(['firstName'])!.value,
      lastName: this.myForm.get(['lastName'])!.value,
      username: this.myForm.get(['username'])!.value,
      businessName: this.myForm.get(['businessName'])!.value,
    };
  }
}
