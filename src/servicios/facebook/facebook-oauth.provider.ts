import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IOathProvider } from '../oauth.provider.interface';
import { CordovaOauth } from 'ng2-cordova-oauth/oauth';
import { Facebook } from '@ionic-native/facebook';
import { Config } from '../../config';
import { OAuthProfile } from '../../modelo/oauth-profile.model';

interface ILoginResponse {
	access_token: string;
}
interface IProfileResponse {
	first_name: string;
	last_name: string;
	email: string;
}
@Injectable()
export class FacebookOauthProvider implements IOathProvider {
	private cordovaOauth: CordovaOauth;
	private http: Http;
	private config: Config;

	constructor(http: Http, config: Config, public fb: Facebook) {
		this.http = http;
		this.config = config;
		this.cordovaOauth = new CordovaOauth();

		this.fb.browserInit(this.config.facebook.appId, "v2.8");
	}
	logOut() {
		return Promise.resolve(true);// this.fb.logout();
	}
	login(config: Config): Promise<any> {
		
		let _this = this;
		return this.fb.login(config.facebook.scope)
			.then(function (response) {
				let userId = response.authResponse.userID;
				let params = new Array<string>();

				
				//Getting name and gender properties
				return _this.fb.api("/me?fields=name,email,gender", params)
					.then(function (user) {
						user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";

						let _perfil: OAuthProfile = new OAuthProfile();
						_perfil.provider = config.source;
						_perfil.email = user.email;
						_perfil.firstName = user.name;
						_perfil.lastName = user.name;
						_perfil.imgUrl = user.picture;

						return Promise.resolve(_perfil);

					}).catch(_=>{
						return Promise.reject(_);
					})
			});
	}

	getProfile(accessToken): Promise<any> {
		let query = `access_token=${accessToken}&format=json`;
		let url = `${this.config.facebook.apiUrl}me?${query}`;
		return this.http.get(url)
			.map(x => x.json())
			.map((x: IProfileResponse) => {
				let profile: OAuthProfile = {
					firstName: x.first_name,
					lastName: x.last_name,
					email: x.email,
					provider: 'facebook',
					imgUrl: '',
					IdUsuario: -1
				};
				return profile;
			})
			.toPromise();
	}
}
