import { NgModule } from '@angular/core';
import { ResourceTypeComponent } from './resource-type.component';
import { RouterModule } from '@angular/router';
import { resourceTypeRoutes } from './resource-type.route';
import { SharedModule } from '../shared/shared.module';
import { DetailResourceTypeComponent } from './detail-resource-type.component';
import { UpdateResourceTypeComponent } from './update-resource-type.component';
import { DeleteResourceTypeModalComponent } from './delete-resource-type-modal.component';

@NgModule({
    declarations: [ResourceTypeComponent, DetailResourceTypeComponent, UpdateResourceTypeComponent, DeleteResourceTypeModalComponent],
    imports: [SharedModule, RouterModule.forChild(resourceTypeRoutes)]
})
export class ResourceTypeModule {}
