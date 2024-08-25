import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';
import { TableComponent } from '../component/table/table.component';
import { IHeader, InputTypeEnum } from '../component/table/table.models';
import { IUser } from '../models/user.models';
import { DeleteUserModalComponent } from './delete-user-modal.component';
import { UserService } from './user.service';
import { HttpRequest } from '@angular/common/http';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'firstName'];
  myForm = this.fb.group({
    firstName: [null],
    lastName: [null],
    username: [null],
    active: [null],
  });
  sessionUser: IUser = this.authService.getSessionUser()!;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.headers = [
      { label: 'Nombre', inputType: InputTypeEnum.TEXT, inputName: 'firstName', sort: true },
      { label: 'Apellido', inputType: InputTypeEnum.TEXT, inputName: 'lastName', sort: true },
      { label: 'Correo Electrónico', inputType: InputTypeEnum.TEXT, inputName: 'username', sort: true },
      { label: 'Activo', inputType: InputTypeEnum.BOOLEAN, inputName: 'active', sort: false }
    ];
  }

  query = (req?: HttpRequest<IResponse>) => this.userService.findAllByFilter(req);

  delete(user: IUser): void {
    this.ngbModalRef = this.modalService.open(DeleteUserModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.user = user;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }
}