import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../component/table/table.component';
import { IHeader } from '../component/table/table.models';
import { IResource } from '../models/resource.models';
import { DeleteResourceModalComponent } from './delete-resource-modal.component';
import { ResourceService } from './resource.service';
import { ResourceTypeService } from '../resource-type/resource-type.service';
import { HttpResponse } from '@angular/common/http';
import { IResponse } from '../models/response.models';
import { IResourceType } from '../models/resourceType.models';
import { IListItem } from '../models/list.models';
import { map } from 'rxjs/operators';
import { IInput, InputTypeEnum } from '../component/filter/filter.models';
import { getListToBoolean } from '../shared/generic-util';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html'
})
export class ResourceComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'description'];

  filterInputs!: IInput[];

  myForm = this.fb.group({
    description: [null],
    code: [null],
    resourceTypeId: [null],
    active: [null],
  });

  resourcesTypes!: IListItem[];

  constructor(
    private resourceService: ResourceService,
    private resourceTypeService: ResourceTypeService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.filterInputs = [
      { label: 'Descripción', type: InputTypeEnum.TEXT, name: 'description', width: 4 },
      { label: 'Código', type: InputTypeEnum.TEXT, name: 'code', width: 4 },
      { label: 'Tipo de Recurso', type: InputTypeEnum.AUTOCOMPLETE, name: 'resourceTypeId', width: 4, onSearch: (search) => this.getResourcesTypes(search) },
      { label: 'Activos', type: InputTypeEnum.LIST, name: 'active', width: 2, itemList: getListToBoolean() },
    ];

    this.headers = [
      { label: 'Descripción', colName: 'description', canSort: true },
      { label: 'Código', colName: 'code', canSort: true },
      { label: 'Tipo de Recurso', colName: 'resourceTypeId', canSort: false },
      { label: 'Activo', colName: 'active', canSort: true }
    ];
  }

  query = (req?: any) => this.resourceService.findAllByFilter(req);

  getItems(): void {
    this.tableComponent.executeQuery({ page: 1 });
  }

  clear(): void {
    this.myForm.reset();
    this.tableComponent.executeQuery({ page: 1 });
  }

  getResourcesTypes(search: { term: string }) {
    if (search.term && search.term.length > 2) {
      this.resourceTypeService.findAllByFilter({ active: true, description: search.term })
        .pipe(
          map((res: HttpResponse<IResponse>) => res.body?.data.content
            .map((rt: IResourceType) => ({ id: rt.id, value: rt.description })))
        )
        .subscribe(
          (res: any) => {
            this.resourcesTypes = res || [];
            this.filterInputs.find(f => f.name === 'resourceTypeId')!.itemList = this.resourcesTypes;
          }
        )
    }
  }

  delete(resource: IResource): void {
    this.ngbModalRef = this.modalService.open(DeleteResourceModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.resource = resource;
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
