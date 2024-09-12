import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../component/table/table.component';
import { IHeader, InputTypeEnum } from '../component/table/table.models';
import { IResource } from '../models/resource.models';
import { DeleteResourceModalComponent } from './delete-resource-modal.component';
import { ResourceService } from './resource.service';
import { ResourceTypeService } from '../resource-type/resource-type.service';
import { HttpResponse } from '@angular/common/http';
import { IResponse } from '../models/response.models';
import { IResourceType } from '../models/resourceType.models';
import { IListItem } from '../models/list.models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html'
})
export class ResourceComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'description'];
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
    this.headers = [
      { label: 'Descripción', inputType: InputTypeEnum.TEXT, inputName: 'description', sort: true },
      { label: 'Código', inputType: InputTypeEnum.TEXT, inputName: 'code', sort: true },
      { label: 'Tipo de Recurso', inputType: InputTypeEnum.AUTOCOMPLETE, inputName: 'resourceTypeId', sort: false },
      { label: 'Activo', inputType: InputTypeEnum.BOOLEAN, inputName: 'active', sort: false }
    ];
  }

  query = (req?: any) => this.resourceService.findAllByFilter(req);

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
