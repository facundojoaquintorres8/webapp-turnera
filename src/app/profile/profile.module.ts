import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DetailProfileComponent } from './detail-profile.component';
import { UpdateProfileComponent } from './update-profile.component';
import { DeleteProfileModalComponent } from './delete-profile-modal.component';
import { profileRoutes } from './profile.route';

@NgModule({
    declarations: [ProfileComponent, DetailProfileComponent, UpdateProfileComponent, DeleteProfileModalComponent],
    imports: [SharedModule, RouterModule.forChild(profileRoutes)]
})
export class ProfileModule {}
