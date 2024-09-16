import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ResourceService } from './resource.service';
import { IResource } from '../models/resource.models';
import { ResourceTypeService } from '../resource-type/resource-type.service';
import { IResourceType } from '../models/resourceType.models';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-update-resource',
  templateUrl: './update-resource.component.html'
})
export class UpdateResourceComponent implements OnInit {
  isSaving = false;

  resourcesTypes: IResourceType[] = [];

  myForm = this.fb.group({
    id: [0],
    description: ['', [Validators.required]],
    code: [''],
    resourcesTypes: this.fb.control<IResourceType[]>([], Validators.required),
    active: [false],
  });

  constructor(
    private resourceService: ResourceService,
    private resourceTypeService: ResourceTypeService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.resourceService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) => this.updateForm(res.body?.data)
      );
    }

    this.resourceTypeService.findAllByFilter({ active: true })
      .subscribe(
        (res: HttpResponse<IResponse>) => {
          this.resourcesTypes = res.body?.data.content || [];
        }
      )
  }

  compareFun(a: IResourceType, b: IResourceType) {
    return a && b ? a.id === b.id : a === b;
  }

  updateForm(resource: IResource): void {
    this.myForm.patchValue({
      id: resource.id,
      description: resource.description,
      code: resource.code,
      resourcesTypes: resource.resourcesTypes,
      active: resource.active
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resource = this.createFromForm();
    if (resource.id) {
      this.subscribeToSaveResponse(this.resourceService.update(resource));
    } else {
      this.subscribeToSaveResponse(this.resourceService.create(resource));
    }
  }

  private createFromForm(): IResource {
    return {
      id: this.myForm.get(['id'])!.value,
      active: this.myForm.get(['active'])!.value,
      description: this.myForm.get(['description'])!.value,
      code: this.myForm.get(['code'])!.value,
      resourcesTypes: this.myForm.get(['resourcesTypes'])!.value,
    };
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => this.previousState(),
      () => this.isSaving = false
    );
  }
}
