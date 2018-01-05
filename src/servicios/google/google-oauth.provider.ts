import { Injectable } from '@angular/core';
import { IOathProvider } from '../oauth.provider.interface';
import { CordovaOauth } from 'ng2-cordova-oauth/oauth';
import { Google } from 'ng2-cordova-oauth/provider/google';
import { Http } from '@angular/http';
import { Config } from '../../config';
import 'rxjs/add/operator/map';
import { GooglePlus } from '@ionic-native/google-plus';
import { OAuthProfile } from '../../modelo/oauth-profile.model';

interface ILoginResponse {
	access_token: string;
}
@Injectable()
export class GoogleOauthProvider implements IOathProvider {
	private http: Http;
	private config: Config;
	private cordovaOauth: CordovaOauth;
	//private google: Google;
constructor(http: Http, config: Config, public googlePlus:GooglePlus) {
		this.http = http;
		this.config = config;
//		this.google = new Google({ clientId: config.google.appId, appScope: config.google.scope });
		this.cordovaOauth = new CordovaOauth();
	}
	logOut(): Promise<any>{
		return this.googlePlus.logout();
	}
login(config:Config): Promise<OAuthProfile> {
	
	return this.googlePlus.login({
		'scopes': config.google.scope, // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
		'webClientId': config.google.appId,
		'offline': true
	}).then(_=>{
		let _perfil:OAuthProfile = new OAuthProfile();
		_perfil.provider = config.source;
		_perfil.email = _.email;
		_perfil.firstName = _.givenName;
		_perfil.lastName = _.familyName;
		_perfil.imgUrl = _.imageUrl;

		return Promise.resolve(_perfil);

	})
		// return this.cordovaOauth.login(this.google).then((x: ILoginResponse) =>
		// { 
			
		// 	return x.access_token;
		// 	});
	}

	
	// getProfile(accessToken: string): Promise<any> {
	// 	let query = `access_token=${accessToken}`;
	// 	let url = `${this.config.google.apiUrl}userinfo?${query}`;
	//   return this.http.get(url)
	// 	  .map(x => x.json())
	// 	  .map(x => {
	// 		let name = x.name.split(' ');
	// 		return {
	// 		  firstName: name[0],
	// 		  lastName: name[1],
	// 		  email: x.email,
	// 		  provider: 'google'
	// 		};
	// 	  })
	// 	  .toPromise();
	//   }
}