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

	constructor(app: App, platform: Platform, menu: MenuController, private statusBar: StatusBar) {
		this.menu = menu;
		this.app = app;
		this.platform = platform;
		this.initializeApp();

		this.initializeApp();

		// set our app's pages
		this.pages = [
			{ title: 'Jugar', component: JugarPage },
			{ title: 'Asistente', component: AsistentePage },
			{ title: 'Panel de Control', component: PrincipalPage },
			{ title: 'Configuracion', component: ConfiguracionPage }
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
		 
		if (globalDataService.getIdUsuario()) {
	
		  this.rootPage = PrincipalPage;
	/*
		  $rootScope.globals.emailSoporte = "verymatch.net@gmail.com";
		  $rootScope.globals.hostSoporte = "http://www.verymatch.net";
		  $rootScope.globals.version = appVersion;
	  */
	  //    $rootScope.globals.Opciones = { BotonValidarSiempreActivo: false, InvertirOrdenJuego: false }
	
	
	  
		  var configuracion = new ConfiguracionService();
		  configuracion.crearTabla(function () {
	
			configuracion.getOption(globalDataService.getIdUsuario(), configuracion.OPCION_SIEMPRE_ACTIVO, function (respuesta) {
			  this.globalData.setData(new Par("BotonValidarSiempreActivo",  respuesta));
			});
	
			configuracion.getOption(globalDataService.getIdUsuario(), configuracion.OPCION_INVERTIR_ORDEN, function (respuesta) {
			  this.globalData.setData(new Par("InvertirOrdenJuego",  respuesta));
			});
		  });
	
		  //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
		  //this.nav.popToRoot();
	
		}
		else
		  this.rootPage = InicioPage;
	  }
}
