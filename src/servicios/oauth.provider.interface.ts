import { Config } from "../config";

export interface IOathProvider {
	login(config:Config): Promise<any>;
	getProfile(accessToken: string): Promise<any>;
	
}