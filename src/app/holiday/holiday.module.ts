import { NgModule } from '@angular/core';
import { HolidayComponent } from './holiday.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DetailHolidayComponent } from './detail-holiday.component';
import { UpdateHolidayComponent } from './update-holiday.component';
import { DeleteHolidayModalComponent } from './delete-holiday-modal.component';
import { holidayRoutes } from './holiday.route';

@NgModule({
    declarations: [HolidayComponent, DetailHolidayComponent, UpdateHolidayComponent, DeleteHolidayModalComponent],
    imports: [SharedModule, RouterModule.forChild(holidayRoutes)]
})
export class HolidayModule {}
