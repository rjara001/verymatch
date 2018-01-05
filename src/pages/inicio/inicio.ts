import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { InfoBase, PageBase } from '../../modelo/InfoBase';
import { globalDataService } from '../../servicios/globalDataService';
import { OAuthService } from '../../servicios/oauth.service';
import { Config } from '../../config';
import { EstadoPage } from '../estado/estado';
import { PrincipalPage } from '../principal/principal';
import { InfoUsuario } from '../../modelo/InfoUsuario';
/**
 * Generated class for the InicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    templateUrl:'inicio.html',
	providers: [OAuthService]
})
export class InicioPage extends PageBase {
    Info : InfoUsuario;
    
    private oauthService: OAuthService;

    constructor(public navCtrl: NavController
        , public navParams: NavParams
        , public alertCtrl: AlertController
        , public loadingCtrl: LoadingController
        , oauthService: OAuthService
        , public toastCtrl: ToastController
        , public globalData: globalDataService ) {

        super(alertCtrl, loadingCtrl,toastCtrl, globalData);
        this.navCtrl
        this.oauthService = oauthService;
        this.Info = new InfoUsuario();
        
    }

 
        login(source: string) {
            let _config:Config  = new Config();
            _config.propio.email = this.Info.Email;
            _config.propio.contraseña = this.Info.Contrasenia;
            _config.source = source;

            this.oauthService.login(_config)
                .then(
                    _ => {
                        if (_.success)
                            this.redireccionLogin();
                        else
                            this.mensaje(_.message);
                    },
                    error => console.log('Problemas al momento de ingresar usuario, error:' + error),
                );
         
        }


    redireccionLogin() {
        //this.oauthService.setOAuthToken();
        this.navCtrl.setRoot(PrincipalPage, {}, { animate: true, direction: 'forward' });

        // $location.path('/jugar');
    }

    loginEmail() {
        //$location.path('/login');
        this.navCtrl.setRoot(InicioPage, {}, { animate: true, direction: 'forward' });
    }




}
