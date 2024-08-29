import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/component/toast/toast.service';
import { IActivateAccount } from 'src/app/models/account.models';
import { matchValues } from 'src/app/shared/custom-validators';
import { AccountService } from '../account.service';
import { IResponse } from 'src/app/models/response.models';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit {
  isSaving = false;

  activationKey!: string;

  myForm = this.fb.group({
    password: [null, [Validators.required]],
    passwordConfirm: [null, [Validators.required, matchValues('password')]],
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    this.activationKey = this.activatedRoute.snapshot.paramMap.get("activationKey")!;
    this.myForm.controls.password.valueChanges.subscribe(() => {
      this.myForm.controls.passwordConfirm.updateValueAndValidity();
    });
  }

  previousState(): void {
    this.router.navigate(['login']);
  }

  save(): void {
    this.isSaving = true;
    this.subscribeToSaveResponse(this.accountService.activate(this.createFromForm()));
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => {
        this.toastService.changeMessage(
          {
            showSuccessToast: true,
            successMessage: 'Su cuenta ha sido activada con éxito. Ya puede ingresar al sistema.'
          }
        );
        this.router.navigate(['/']);
      },
      () => this.isSaving = false
    );
  }

  private createFromForm(): IActivateAccount {
    return {
      password: this.myForm.get(['password'])!.value,
      activationKey: this.activationKey,
    };
  }
}
