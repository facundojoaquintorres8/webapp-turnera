import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth/auth.service';
import { TableComponent } from '../component/table/table.component';
import { IHeader } from '../component/table/table.models';
import { IUser } from '../models/user.models';
import { DeleteUserModalComponent } from './delete-user-modal.component';
import { UserService } from './user.service';
import { HttpRequest } from '@angular/common/http';
import { IResponse } from '../models/response.models';
import { IInput, InputTypeEnum } from '../component/filter/filter.models';
import { getListToBoolean } from '../shared/generic-util';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'firstName'];

  filterInputs!: IInput[];

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
    this.filterInputs = [
      { label: 'Nombre', type: InputTypeEnum.TEXT, name: 'firstName', width: 3 },
      { label: 'Apellido', type: InputTypeEnum.TEXT, name: 'lastName', width: 3 },
      { label: 'Correo Electrónico', type: InputTypeEnum.TEXT, name: 'username', width: 4 },
      { label: 'Activos', type: InputTypeEnum.LIST, name: 'active', width: 2, itemList: getListToBoolean() },
    ];

    this.headers = [
      { label: 'Nombre', colName: 'firstName', canSort: true },
      { label: 'Apellido', colName: 'lastName', canSort: true },
      { label: 'Correo Electrónico', colName: 'username', canSort: true },
      { label: 'Activo', colName: 'active', canSort: true }
    ];
  }

  query = (req?: HttpRequest<IResponse>) => this.userService.findAllByFilter(req);

  getItems(): void {
    this.tableComponent.executeQuery({ page: 1 });
  }

  clear(): void {
    this.myForm.reset();
    this.tableComponent.executeQuery({ page: 1 });
  }

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