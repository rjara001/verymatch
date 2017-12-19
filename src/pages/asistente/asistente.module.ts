import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsistentePage } from './asistente';

@NgModule({
  declarations: [
    AsistentePage,
  ],
  imports: [
    IonicPageModule.forChild(AsistentePage),
  ],
})
export class AsistentePageModule {}
