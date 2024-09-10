import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionModule } from '../security/permission.module';
import { TableComponent } from '../component/table/table.component';
import { PaginateComponent } from '../component/table/paginated.component';
import { TableHeaderComponent } from '../component/table/table-header.component';
import { ObservationModalComponent } from '../component/observation-modal/observation-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [TableComponent, TableHeaderComponent, PaginateComponent, ObservationModalComponent],
    imports: [CommonModule, PermissionModule, ReactiveFormsModule, NgbModule, NgSelectModule],
    exports: [
        FormsModule,
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        PermissionModule,
        TableComponent,
        TableHeaderComponent,
        PaginateComponent,
        ObservationModalComponent,
    ]
})
export class SharedModule { }
