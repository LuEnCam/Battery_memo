import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BatteriesPage } from './batteries.page';

const routes: Routes = [
  {
    path: '',
    component: BatteriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatteriesPageRoutingModule {}
