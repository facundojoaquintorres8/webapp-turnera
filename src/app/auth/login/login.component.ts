import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogin } from 'src/app/models/login.models';
import { AuthService } from '../auth.service';
import { IResponse } from 'src/app/models/response.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  isSaving = false;

  myForm = this.fb.group({
    username: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: [null, [Validators.required]],
  });

  constructor(private router: Router, private fb: UntypedFormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.logout();
  }

  login(): void {
    this.isSaving = true;
    this.authService.login(this.createFromForm()).subscribe(
      (res: HttpResponse<IResponse>) => {
        this.authService.onLoginSuccess(res.body?.data);
        this.router.navigate(['/schedule']);
      },
      () => this.isSaving = false
    );
  }

  private createFromForm(): ILogin {
    return {
      username: this.myForm.get(['username'])!.value,
      password: this.myForm.get(['password'])!.value,
    };
  }
}
