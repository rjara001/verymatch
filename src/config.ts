import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public source:string;

	public facebook = {
		apiUrl: "https://graph.facebook.com/v2.3",
		appId: 161872341248044,
		scope: ['public_profile','email']
	}
	
	public google = {
		apiUrl: "https://googleapis.com/oauth2/v3/",
		appId: "759430229541-uncdca7du2i6t88g01nkls53n3494pr8.apps.googleusercontent.com",
		scope: ''
	}

	public propio ={
		appId:"2"
		,email:""
		,contraseña:""
	}

	constructor(){
		
	}
}