import { Config } from "../config";
import { OAuthProfile } from "../modelo/oauth-profile.model";

export interface IOathProvider {
	login(config:Config): Promise<OAuthProfile>;
	logOut(config:Config);
	//getProfile(accessToken: string): Promise<any>;
	
}