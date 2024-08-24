import { NgModule } from '@angular/core';
import { CustomerComponent } from './customer.component';
import { RouterModule } from '@angular/router';
import { customerRoutes } from './customer.route';
import { SharedModule } from '../shared/shared.module';
import { DetailCustomerComponent } from './detail-customer.component';
import { UpdateCustomerComponent } from './update-customer.component';
import { DeleteCustomerModalComponent } from './delete-customer-modal.component';

@NgModule({
    declarations: [CustomerComponent, DetailCustomerComponent, UpdateCustomerComponent, DeleteCustomerModalComponent],
    imports: [SharedModule, RouterModule.forChild(customerRoutes)]
})
export class CustomerModule {}
