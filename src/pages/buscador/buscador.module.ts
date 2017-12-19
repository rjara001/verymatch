import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuscadorPage } from './buscador';

@NgModule({
  declarations: [
    BuscadorPage,
  ],
  imports: [
    IonicPageModule.forChild(BuscadorPage),
  ],
})
export class BuscadorPageModule {}
