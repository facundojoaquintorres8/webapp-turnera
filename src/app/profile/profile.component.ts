import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../component/table/table.component';
import { IHeader, InputTypeEnum } from '../component/table/table.models';
import { IProfile } from '../models/profile.models';
import { DeleteProfileModalComponent } from './delete-profile-modal.component';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'description'];
  myForm = this.fb.group({
    description: [null],
    active: [null],
  });
  constructor(
    private profileService: ProfileService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.headers = [
      { label: 'Descripción', inputType: InputTypeEnum.TEXT, inputName: 'description', sort: true },
      { label: 'Activo', inputType: InputTypeEnum.BOOLEAN, inputName: 'active', sort: false }
    ];
  }

  query = (req?: any) => this.profileService.findAllByFilter(req);

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
