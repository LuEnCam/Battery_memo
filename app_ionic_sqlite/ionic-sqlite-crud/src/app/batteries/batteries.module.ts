import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BatteriesPageRoutingModule } from './batteries-routing.module';

import { BatteriesPage } from './batteries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BatteriesPageRoutingModule
  ],
  declarations: [BatteriesPage]
})
export class BatteriesPageModule {}
