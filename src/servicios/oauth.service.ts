import { Injectable, Injector } from '@angular/core';
import { FacebookOauthProvider } from './facebook/facebook-oauth.provider';
import { IOathProvider } from './oauth.provider.interface';
import { GoogleOauthProvider } from './google/google-oauth.provider';
import { PropioOauthProvider } from './propio/propio-oauth.provider';
import { Config } from '../config';
import { IOAuthToken } from '../modelo/oauth-token.model';
import { globalDataService } from './globalDataService';

@Injectable()
export class OAuthService {
	private oauthTokenKey = 'oauthToken';
	private injector: Injector;
	constructor(injector: Injector) {
		this.injector = injector;
	}
	login(config: Config): Promise<any> {
		return this.getOAuthService(config.source).login(config).then(accessToken => {
			if (!accessToken) {
				return Promise.reject('No access token found');
			}
			if (accessToken.success)
			{
				let oauthToken = {
					accessToken: accessToken,
					source: config.source
				};
				this.setOAuthToken(oauthToken, config);
	
				return this.setCredentials(oauthToken, config).then(()=>{
					return Promise.resolve(accessToken)
				});
	
			}
			return Promise.resolve(accessToken);

		});
	}

	setCredentials(oauthToken: any, config:Config):Promise<void> {

		return this.getProfile().then(_ => {
			if (_)
			{
				let _respuestaUsuario = JSON.parse(_._body);
				globalDataService.setCodigoUsuario(_respuestaUsuario.idUsuario);
				globalDataService.setEmailUsuario(_respuestaUsuario.idUsuario);
			}				
			else
				throw Error("Error al tratar de validar usuario.");

			//window.localStorage.setItem("usuario", _.username);

		})

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
	setOAuthToken(token: IOAuthToken, config: Config) {

		localStorage.setItem(this.oauthTokenKey, JSON.stringify(token));

	}
	getOAuthToken(): IOAuthToken {
		let token = localStorage.getItem(this.oauthTokenKey);
		return token ? JSON.parse(token) : null;
	}

	getProfile(): Promise<any> {
		if (!this.isAuthorized()) {
			return Promise.reject('You are not authorized');
		}
		let oauthService = this.getOAuthService();
		return oauthService.getProfile(this.getOAuthToken().accessToken);
	}
	isAuthorized(): boolean {
		return !!this.getOAuthToken();
	}
}