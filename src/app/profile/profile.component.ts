import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../component/table/table.component';
import { IHeader } from '../component/table/table.models';
import { IProfile } from '../models/profile.models';
import { DeleteProfileModalComponent } from './delete-profile-modal.component';
import { ProfileService } from './profile.service';
import { IInput, InputTypeEnum } from '../component/filter/filter.models';
import { getListToBoolean } from '../shared/generic-util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'description'];
  
  filterInputs!: IInput[];

  myForm = this.fb.group({
    description: [null],
    active: [null],
  });

  constructor(
    private profileService: ProfileService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.filterInputs = [
      { label: 'Descripción', type: InputTypeEnum.TEXT, name: 'description', width: 4 },
      { label: 'Activos', type: InputTypeEnum.LIST, name: 'active', width: 2, itemList: getListToBoolean() },
    ];

    this.headers = [
      { label: 'Descripción', colName: 'description', canSort: true },
      { label: 'Activo', colName: 'active', canSort: true }
    ];
  }

  query = (req?: any) => this.profileService.findAllByFilter(req);

  getItems(): void {
    this.tableComponent.executeQuery({ page: 1 });
  }

  clear(): void {
    this.myForm.reset();
    this.tableComponent.executeQuery({ page: 1 });
  }

  delete(profile: IProfile): void {
    this.ngbModalRef = this.modalService.open(DeleteProfileModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.profile = profile;
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
