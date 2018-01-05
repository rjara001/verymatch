import { Injectable, Injector } from '@angular/core';
import { FacebookOauthProvider } from './facebook/facebook-oauth.provider';
import { IOathProvider } from './oauth.provider.interface';
import { GoogleOauthProvider } from './google/google-oauth.provider';
import { PropioOauthProvider } from './propio/propio-oauth.provider';
import { Config } from '../config';
import { IOAuthToken } from '../modelo/oauth-token.model';
import { globalDataService } from './globalDataService';
import { Constantes } from '../modelo/enums';
import { OAuthProfile } from '../modelo/oauth-profile.model';

@Injectable()
export class OAuthService {
	private oauthTokenKey = 'oauthToken';
	private injector: Injector;
	constructor(injector: Injector, public globalData: globalDataService, public servicioPropio: PropioOauthProvider) {
		this.injector = injector;
	}

	logOut(): Promise<void> {
		let _config: Config = new Config();
		_config.propio.email = this.globalData.getEmailUsuario();
		_config.propio.contraseña = "";
		_config.source = this.globalData.getProvider();

		if (_config.source)
			return this.getOAuthService(_config.source).logOut(_config).then(_ => {
				this.globalData.clear()
				return Promise.resolve();
			});

		return Promise.resolve();
	}

	login(config: Config): Promise<any> {
		return this.getOAuthService(config.source).login(config).then(_perfil => {

			if (!_perfil)
				return Promise.resolve({ success: true, message: 'usuario y/o contraseña incorrectos' });

			return this.setProfile(_perfil).then(_ => {
				this.setOAuthToken(_, config);

				this.setCredentials(_, config);

				return Promise.resolve({ success: true, message: 'logeado con exito' });
			});



			//return Promise.resolve(accessToken);

		});
	}
	setProfile(oauthToken: OAuthProfile): Promise<OAuthProfile> {
		this.servicioPropio.usuario.IdUsuario = oauthToken.email;
		this.servicioPropio.usuario.Olvido = false;

		this.servicioPropio.usuario.idapporigen = Constantes.idapporigen;

		return this.servicioPropio.getProfile().then(_ => {
			oauthToken.IdUsuario = JSON.parse(_._body).idUsuario;

			return Promise.resolve(oauthToken);

		});
	}
	setCredentials(oauthToken: OAuthProfile, config: Config) {
		// console.log("entrando a obtener credenciales");
		// return this.getProfile().then(_ => {
		// 	if (_) {
		// 		console.log(_);
		// 		console.log(_._body);

		// 		let _respuestaUsuario = JSON.parse(_._body);
		// 		this.globalData.setCodigoUsuario(_respuestaUsuario.idUsuario);
		this.globalData.setEmailUsuario(oauthToken.email);
		this.globalData.setCodigoUsuario(oauthToken.IdUsuario);
		// 	}
		// 	else
		// 		throw Error("Error al tratar de validar usuario.");

		// 	//window.localStorage.setItem("usuario", _.username);

		// })

	}

	getOAuthService(source?: string): IOathProvider {
		source = source || this.getOAuthToken().source;
		switch (source) {
			case 'facebook':
				return this.injector.get(FacebookOauthProvider);
			case 'google':
				return this.injector.get(GoogleOauthProvider);
			case 'propio':
				return this.injector.get(PropioOauthProvider);
			default:
				throw new Error(`Source '${source}' is not valid`);
		}
	}
	setOAuthToken(token: OAuthProfile, config: Config) {

		localStorage.setItem(this.oauthTokenKey, JSON.stringify(token));

	}
	getOAuthToken(): IOAuthToken {
		let token = localStorage.getItem(this.oauthTokenKey);
		return token ? JSON.parse(token) : null;
	}

	// getProfile(): Promise<any> {
	// 	if (!this.isAuthorized()) {
	// 		return Promise.reject('You are not authorized');
	// 	}
	// 	let oauthService = this.getOAuthService();
	// 	return oauthService.getProfile(this.getOAuthToken().accessToken);
	// }

	isAuthorized(): boolean {
		return !!this.getOAuthToken();
	}

	Register(email: string): Promise<any> {
		this.servicioPropio.usuario.idapporigen = Constantes.idapporigen;
		this.servicioPropio.usuario.tokenNotificacion = Constantes.tokenNotificacion;
		this.servicioPropio.usuario.IdUsuario = email;

		return this.servicioPropio.registrar();



	}
}