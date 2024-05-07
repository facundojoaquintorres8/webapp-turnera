import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ResourceService } from './resource.service';
import { AuthService } from '../auth/auth.service';
import { IResource } from '../models/resource.models';
import { ResourceTypeService } from '../resource-type/resource-type.service';
import { IResourceType } from '../models/resourceType.models';

@Component({
  selector: 'app-update-resource',
  templateUrl: './update-resource.component.html'
})
export class UpdateResourceComponent implements OnInit {
  isSaving = false;

  resourcesTypes!: IResourceType[];

  myForm = this.fb.group({
    id: [],
    description: [null, [Validators.required]],
    code: [null],
    resourceTypeId: [null, [Validators.required]],
    active: [null],
  });

  constructor(
    private resourceService: ResourceService,
    private resourceTypeService: ResourceTypeService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.resourceService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResource>) => this.updateForm(res.body!)
      );
    }

    this.resourceTypeService.findAllByFilter({ active: true })
      .subscribe(
        (res: HttpResponse<any>) => {
          this.resourcesTypes = res.body.content || [];
        }
      )
  }

  updateForm(resource: IResource): void {
    this.myForm.patchValue({
      id: resource.id,
      description: resource.description,
      code: resource.code,
      resourceTypeId: resource.resourceType.id,
      active: resource.active,
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
      resourceType: this.resourcesTypes.find(x => x.id == this.myForm.get(['resourceTypeId'])!.value)!,
    };
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResource>>): void {
    result.subscribe(
      () => this.previousState(),
      () => this.isSaving = false
    );
  }
}
