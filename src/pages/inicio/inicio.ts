import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { InfoBase, PageBase } from '../../modelo/InfoBase';
import { globalDataService } from '../../servicios/globalDataService';
import { OAuthService } from '../../servicios/oauth.service';
import { Config } from '../../config';
import { InfoUsuario } from '../../modelo/InfoUsuario';
import { EstadoPage } from '../estado/estado';
import { PrincipalPage } from '../principal/principal';
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
        , oauthService: OAuthService) {
        super(alertCtrl, loadingCtrl);
        
        this.oauthService = oauthService;
        this.Info = new InfoUsuario();
        
    }
        login(source: string) {
            let _config:Config  = new Config();
            _config.propio.usuario = this.Info.IdUsuario;
            _config.propio.contraseña = this.Info.Contrasenia;
            _config.source = source;

            this.oauthService.login(_config)
                .then(
                    _ => {
                        if (_.accessToken.success)
                            this.redireccionLogin();
                        else
                            this.mensaje("Validando credenciales.", _.accessToken.message);
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

    mensaje(titulo, texto) {
        let alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['OK']
          });
          alert.present();

    }



}
