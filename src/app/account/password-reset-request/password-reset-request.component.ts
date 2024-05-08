import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/component/toast/toast.service';
import { IPasswordResetRequest } from 'src/app/models/account.models';
import { AccountService } from '../account.service';
import { IResponse } from 'src/app/models/response.models';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html'
})
export class PasswordResetRequestComponent implements OnInit {
  isSaving = false;

  myForm = this.fb.group({
    username: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void { }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.accountService.passwordResetRequest(this.createFromForm()));
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => {
        this.toastService.changeMessage(
          {
            showSuccessToast: true,
            successMessage: 'Su solicitud ha sido procesada con éxito. Revise su Correo Electrónico para continuar.'
          }
        );
        this.router.navigate(['/']);
      },
      () => this.isSaving = false
    );
  }

  private createFromForm(): IPasswordResetRequest {
    return {
      username: this.myForm.get(['username'])!.value,
    };
  }
}
