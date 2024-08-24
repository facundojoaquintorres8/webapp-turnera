import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { RouterModule } from '@angular/router';
import { userRoutes } from './user.route';
import { SharedModule } from '../shared/shared.module';
import { DetailUserComponent } from './detail-user.component';
import { UpdateUserComponent } from './update-user.component';
import { DeleteUserModalComponent } from './delete-user-modal.component';
import { PasswordChangeComponent } from '../account/password-change/password-change.component';

@NgModule({
    declarations: [UserComponent, DetailUserComponent, UpdateUserComponent, DeleteUserModalComponent, PasswordChangeComponent],
    imports: [SharedModule, RouterModule.forChild(userRoutes)]
})
export class UserModule {}
