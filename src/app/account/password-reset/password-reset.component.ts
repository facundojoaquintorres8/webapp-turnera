import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/component/toast/toast.service';
import { IPasswordReset } from 'src/app/models/account.models';
import { matchValues } from 'src/app/shared/custom-validators';
import { AccountService } from '../account.service';
import { IResponse } from 'src/app/models/response.models';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit {
  isSaving = false;

  resetKey!: string;

  myForm = this.fb.group({
    password: [null, [Validators.required]],
    passwordConfirm: [null, [Validators.required, matchValues('password')]],
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private accountService: AccountService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.resetKey = this.activatedRoute.snapshot.paramMap.get("resetKey")!;
    this.myForm.controls.password.valueChanges.subscribe(() => {
      this.myForm.controls.passwordConfirm.updateValueAndValidity();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.accountService.passwordReset(this.createFromForm()));
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => {
        this.toastService.changeMessage(
          {
            showSuccessToast: true,
            successMessage: 'Su Contraseña ha sido guardada con éxito. Ya puede ingresar al sistema.'
          }
        );
        this.router.navigate(['/']);
      },
      () => this.isSaving = false
    );
  }

  private createFromForm(): IPasswordReset {
    return {
      password: this.myForm.get(['password'])!.value,
      resetKey: this.resetKey,
    };
  }
}
