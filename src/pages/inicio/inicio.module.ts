import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InicioPage } from './inicio';
import { IonicModule } from 'ionic-angular';

@NgModule({
  imports: [IonicModule],
  declarations: [
    InicioPage,
  ],
  entryComponents: [
		InicioPage
	],

	providers: [
	]
})
export class InicioPageModule {}
