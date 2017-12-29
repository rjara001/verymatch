import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public source:string;

	public facebook = {
		apiUrl: "https://graph.facebook.com/v2.3",
		appId: "1825134854185227",
		scope: ['email']
	}
	
	public google = {
		apiUrl: "https://googleapis.com/oauth2/v3/",
		appId: "759430229541-uncdca7du2i6t88g01nkls53n3494pr8.apps.googleusercontent.com",
		scope: ['email']
	}

	public propio ={
		appId:"2"
		,email:""
		,contraseña:""
	}

	constructor(){
		
	}
}