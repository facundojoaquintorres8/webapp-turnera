import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.models';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { IProfile } from '../models/profile.models';
import { ProfileService } from '../profile/profile.service';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html'
})
export class UpdateUserComponent implements OnInit {
  isSaving = false;

  profiles: IProfile[] = [];

  myForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
    active: [null],
  });

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.profileService.findAllByFilter({ active: true }).subscribe(
      (res1: HttpResponse<any>) => {
        this.profiles = res1.body.content || [];
        const id = this.activatedRoute.snapshot.paramMap.get("id");
        if (id) {
          this.userService.find(parseInt(id)).subscribe(
            (res2: HttpResponse<IResponse>) => {
              this.updateForm(res2.body?.data, this.profiles);
            }
          );
        }
      }
    )
  }

  updateForm(user: IUser, allProfiles: IProfile[]): void {
    const profilesIds = user.profiles.map(x => x.id);
    allProfiles.forEach(p => {
      p['selected'] = profilesIds.find(x => x === p.id) !== undefined;
    });
    this.myForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.username,
      active: user.active,
    });
  }

  selectProfile(profile: IProfile): void {
    profile['selected'] = !profile['selected'];
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const user = this.createFromForm();
    if (user.id) {
      this.subscribeToSaveResponse(this.userService.update(user));
    } else {
      this.subscribeToSaveResponse(this.userService.create(user));
    }
  }

  private createFromForm(): IUser {
    return {
      id: this.myForm.get(['id'])!.value,
      active: this.myForm.get(['active'])!.value,
      firstName: this.myForm.get(['firstName'])!.value,
      lastName: this.myForm.get(['lastName'])!.value,
      username: this.myForm.get(['email'])!.value,
      profiles: this.profiles.filter(x => x['selected'])
    };
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => this.previousState(),
      () => this.isSaving = false
    );
  }
}
