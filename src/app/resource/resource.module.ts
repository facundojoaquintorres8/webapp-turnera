import { NgModule } from '@angular/core';
import { ResourceComponent } from './resource.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DetailResourceComponent } from './detail-resource.component';
import { UpdateResourceComponent } from './update-resource.component';
import { DeleteResourceModalComponent } from './delete-resource-modal.component';
import { resourceRoutes } from './resource.route';

@NgModule({
    declarations: [ResourceComponent, DetailResourceComponent, UpdateResourceComponent, DeleteResourceModalComponent],
    imports: [SharedModule, RouterModule.forChild(resourceRoutes)]
})
export class ResourceModule {}
