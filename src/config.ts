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
		apiUrl: "https://googleapis.com/oauth2/v3",
		appId: "650188028899-okimlak9thv67icddebbskmi4da30vn1.apps.googleusercontent.com",
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