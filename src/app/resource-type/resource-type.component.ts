import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../component/table/table.component';
import { IHeader } from '../component/table/table.models';
import { IResourceType } from '../models/resourceType.models';
import { DeleteResourceTypeModalComponent } from './delete-resource-type-modal.component';
import { ResourceTypeService } from './resource-type.service';
import { IInput, InputTypeEnum } from '../component/filter/filter.models';
import { getListToBoolean } from '../shared/generic-util';

@Component({
  selector: 'app-resource-type',
  templateUrl: './resource-type.component.html'
})
export class ResourceTypeComponent implements OnInit {
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
    private resourceTypeService: ResourceTypeService,
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

  query = (req?: any) => this.resourceTypeService.findAllByFilter(req);

  getItems(): void {
    this.tableComponent.executeQuery({ page: 1 });
  }

  clear(): void {
    this.myForm.reset();
    this.tableComponent.executeQuery({ page: 1 });
  }

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
