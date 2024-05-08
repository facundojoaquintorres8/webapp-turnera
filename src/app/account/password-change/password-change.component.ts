import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IPasswordChange } from 'src/app/models/account.models';
import { matchValues } from 'src/app/shared/custom-validators';
import { AccountService } from '../account.service';
import { IResponse } from 'src/app/models/response.models';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html'
})
export class PasswordChangeComponent implements OnInit {
  isSaving = false;

  myForm = this.fb.group({
    currentPassword: [null, [Validators.required]],
    password: [null, [Validators.required]],
    passwordConfirm: [null, [Validators.required, matchValues('password')]],
  });

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.myForm.controls.password.valueChanges.subscribe(() => {
      this.myForm.controls.passwordConfirm.updateValueAndValidity();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.accountService.passwordChange(this.createFromForm()));
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => this.previousState(),
      () => this.isSaving = false
    );
  }

  private createFromForm(): IPasswordChange {
    return {
      username: this.authService.getSessionUser()?.username!,
      currentPassword: this.myForm.get(['currentPassword'])!.value,
      password: this.myForm.get(['password'])!.value,
    };
  }
}
