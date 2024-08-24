import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../component/table/table.component';
import { IHeader, InputTypeEnum } from '../component/table/table.models';
import { IResourceType } from '../models/resourceType.models';
import { DeleteResourceTypeModalComponent } from './delete-resource-type-modal.component';
import { ResourceTypeService } from './resource-type.service';

@Component({
  selector: 'app-resource-type',
  templateUrl: './resource-type.component.html'
})
export class ResourceTypeComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'description'];
  myForm = this.fb.group({
    description: [null],
    active: [null],
  });


  constructor(
    private resourceTypeService: ResourceTypeService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.headers = [
      { label: 'Descripción', inputType: InputTypeEnum.TEXT, inputName: 'description', sort: true },
      { label: 'Activo', inputType: InputTypeEnum.BOOLEAN, inputName: 'active', sort: false }
    ];
  }

  query = (req?: any) => this.resourceTypeService.findAllByFilter(req);

  delete(resourceType: IResourceType): void {
    this.ngbModalRef = this.modalService.open(DeleteResourceTypeModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.resourceType = resourceType;
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
