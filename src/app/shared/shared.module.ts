import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbInputDatepickerConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionModule } from '../security/permission.module';
import { TableComponent } from '../component/table/table.component';
import { PaginateComponent } from '../component/table/paginated.component';
import { ObservationModalComponent } from '../component/observation-modal/observation-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterComponent } from '../component/filter/filter.component';
import { CustomDatePickerConfig } from './generic-util';
import { AppointmentStatusComponent } from '../component/appointment-status/appointment-status.component';

@NgModule({
    declarations: [TableComponent, PaginateComponent, ObservationModalComponent, FilterComponent, AppointmentStatusComponent],
    imports: [CommonModule, PermissionModule, ReactiveFormsModule, NgbModule, NgSelectModule],
    exports: [
        FormsModule,
        CommonModule,
        NgbModule,
        ReactiveFormsModule,
        PermissionModule,
        NgSelectModule,
        TableComponent,
        PaginateComponent,
        ObservationModalComponent,
        FilterComponent,
        AppointmentStatusComponent
    ],
    providers: [
        { provide: NgbInputDatepickerConfig, useClass: CustomDatePickerConfig },
    ]
})
export class SharedModule { }
