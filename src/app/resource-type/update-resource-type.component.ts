import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ResourceTypeService } from './resource-type.service';
import { IResourceType } from '../models/resourceType.models';
import { IResponse } from '../models/response.models';

@Component({
  selector: 'app-update-resource-type',
  templateUrl: './update-resource-type.component.html'
})
export class UpdateResourceTypeComponent implements OnInit {
  isSaving = false;

  myForm = this.fb.group({
    id: [0],
    description: ['', [Validators.required]],
    active: [false],
  });

  constructor(
    private resourceTypeService: ResourceTypeService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.resourceTypeService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) => this.updateForm(res.body?.data)
      );
    }
  }

  updateForm(resourceType: IResourceType): void {
    this.myForm.patchValue({
      id: resourceType.id,
      description: resourceType.description,
      active: resourceType.active,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const resourceType = this.createFromForm();
    if (resourceType.id) {
      this.subscribeToSaveResponse(this.resourceTypeService.update(resourceType));
    } else {
      this.subscribeToSaveResponse(this.resourceTypeService.create(resourceType));
    }
  }

  private createFromForm(): IResourceType {
    return {
      id: this.myForm.get(['id'])!.value,
      active: this.myForm.get(['active'])!.value,
      description: this.myForm.get(['description'])!.value,
    };
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<IResponse>>): void {
    result.subscribe(
      () => this.previousState(),
      () => this.isSaving = false
    );
  }
}
