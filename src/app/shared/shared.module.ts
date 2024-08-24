import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './font-awesome-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PermissionModule } from '../security/permission.module';
import { TableComponent } from '../component/table/table.component';
import { PaginateComponent } from '../component/table/paginated.component';
import { TableHeaderComponent } from '../component/table/table-header.component';
import { ObservationModalComponent } from '../component/observation-modal/observation-modal.component';

@NgModule({
    declarations: [TableComponent, TableHeaderComponent, PaginateComponent, ObservationModalComponent],
    imports: [CommonModule, PermissionModule, FontAwesomeModule, ReactiveFormsModule, NgbModule],
    exports: [
        FormsModule,
        CommonModule,
        NgbModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        PermissionModule,
        TableComponent,
        TableHeaderComponent,
        PaginateComponent,
        ObservationModalComponent,
    ]
})
export class SharedModule {
  constructor(iconLibrary: FaIconLibrary) {
    iconLibrary.addIcons(...fontAwesomeIcons);
  }
}
