import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionModule } from '../security/permission.module';
import { TableComponent } from '../component/table/table.component';
import { PaginateComponent } from '../component/table/paginated.component';
import { ObservationModalComponent } from '../component/observation-modal/observation-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterComponent } from '../component/filter/filter.component';

@NgModule({
    declarations: [TableComponent, PaginateComponent, ObservationModalComponent, FilterComponent],
    imports: [CommonModule, PermissionModule, ReactiveFormsModule, NgbModule, NgSelectModule],
    exports: [
        FormsModule,
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        PermissionModule,
        TableComponent,
        PaginateComponent,
        ObservationModalComponent,
        FilterComponent,
    ]
})
export class SharedModule { }
