
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Config } from '../config';

import { MyApp } from './app.component';
import { OAuthService } from '../servicios/oauth.service';
import { GoogleOauthProvider } from '../servicios/google/google-oauth.provider';
import { FacebookOauthProvider } from '../servicios/facebook/facebook-oauth.provider';

import { AsistentePage } from '../pages/asistente/asistente';
import { PrincipalPage } from '../pages/principal/principal';
import { RegistrarPage } from '../pages/registrar/registrar';
import { UsuarioPage } from '../pages/usuario/usuario';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';
import { JugarPage } from '../pages/jugar/jugar';
import { SQLite } from '@ionic-native/sqlite';
import { globalDataService } from '../servicios/globalDataService';
//import { PropioOauthProvider } from '../servicios/propio/propio-oauth.provider';
import { InicioPageModule } from '../pages/inicio/inicio.module';
import { PropioOauthProvider } from '../servicios/propio/propio-oauth.provider';

@NgModule({
	declarations: [
		MyApp,
		AsistentePage,
		ConfiguracionPage,
		PrincipalPage,
		RegistrarPage,
		UsuarioPage,
		JugarPage
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp),
		InicioPageModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		AsistentePage,
		ConfiguracionPage,
		PrincipalPage,
		RegistrarPage,
		UsuarioPage,
		JugarPage
	],
	providers: [
		Config,
		StatusBar,
		GoogleOauthProvider,
		FacebookOauthProvider,
		globalDataService,
		OAuthService,
		SQLite,
		PropioOauthProvider,
		{provide: ErrorHandler, useClass: IonicErrorHandler}
	]
})
export class AppModule {
}
