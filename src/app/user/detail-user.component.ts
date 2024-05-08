import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../models/user.models';
import { UserService } from './user.service';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html'
})
export class DetailUserComponent implements OnInit {
  user!: IUser;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.userService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) =>  this.user = res.body?.data
      );
    }
  }

  previousState(): void {
    window.history.back();
  }
}
