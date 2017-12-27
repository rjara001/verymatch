import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';

import { App, MenuController, Nav, Platform } from 'ionic-angular';
import { AsistentePage } from '../pages/asistente/asistente';
import { JugarPage } from '../pages/jugar/jugar';
import { PrincipalPage } from '../pages/principal/principal';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';
import { globalDataService, Par } from '../servicios/globalDataService';
import { ConfiguracionService } from '../servicios/ConfiguracionService';
import { InicioPage } from '../pages/inicio/inicio';
import { UsuarioPage } from '../pages/usuario/usuario';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	pages;
	rootPage;

	private app;
	private platform;
	private menu: MenuController;

	@ViewChild(Nav) nav: Nav;

	constructor(app: App
		, platform: Platform
		, menu: MenuController
		, private statusBar: StatusBar
		, private globalData:globalDataService) {
		this.menu = menu;
		this.app = app;
		this.platform = platform;
		this.initializeApp();

		this.initializeApp();

		// set our app's pages
		this.pages = [
			{ title: 'Jugar', component: JugarPage , icon: 'md-game-controller-b'},
			{ title: 'Asistente', component: AsistentePage, icon: 'md-microphone' },
			{ title: 'Panel de Control', component: PrincipalPage, icon: 'md-pulse' },
			{ title: 'Configuracion', component: ConfiguracionPage, icon: 'md-build' },
			{ title: 'Info Usuario', component: UsuarioPage, icon: 'md-body' }
		];

		this.rootPage;
	}

	// initializeApp() {
	// 	this.platform.ready().then(() => {
	// 		this.statusBar.styleDefault();
	// 	});
	// }

	openPage(page) {
		this.menu.close();
		this.nav.setRoot(page.component);
	}


	initializeApp() {
		this.platform.ready().then(() => {
		  // Okay, so the platform is ready and our plugins are available.
		  // Here you can do any higher level native things you might need.
		  this.statusBar.styleDefault();
		 // this.splashScreen.hide();
	
		//  (new db(this.sqlite)).createDatabase();
	
		  this._inicializar();
	
		});
	  }
	
	//   openPage(page) {
	// 	// Reset the content nav to have just this page
	// 	// we wouldn't want the back button to show in this scenario
	// 	this.nav.setRoot(page.component);
	//   }
	
	  _inicializar() {
		 
		if (this.globalData.getCodigoUsuario()) {
	
		  this.rootPage = PrincipalPage;
		}
		else
		  this.rootPage = InicioPage;
	  }
}
