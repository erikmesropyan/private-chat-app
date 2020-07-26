import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserDataResolverService} from '../shared/services/user-data-resolver.service';
import {ChatComponent} from './chat.component';


let routes: Routes;
routes = [
  {
    path: '',
    component: ChatComponent,
    resolve: {
      users: UserDataResolverService
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {
}
