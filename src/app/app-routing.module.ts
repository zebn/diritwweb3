import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainFeedComponent} from "./main-feed/main-feed.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
    { path: '', redirectTo: '/main-feed', pathMatch: 'full' },
    { path: 'main-feed', component: MainFeedComponent },
    { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
