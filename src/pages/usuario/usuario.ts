import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { PageBase } from '../../modelo/InfoBase';
import { globalDataService } from '../../servicios/globalDataService';
import { ConfiguracionService } from '../../servicios/ConfiguracionService';
import { Constantes } from '../../modelo/enums';
import { InicioPage } from '../inicio/inicio';

/**
 * Generated class for the UsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage extends PageBase{

  info={usuario:"", soporte:"", host:"", version:""}

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public globalData: globalDataService
    , public configuracion: ConfiguracionService
    , public alertCtrl: AlertController
    , public loadingCtrl: LoadingController
    , public toastCtrl: ToastController) {
    super(alertCtrl, loadingCtrl, toastCtrl, globalData)
  }

  ngOnInit(){

    this.info.usuario =this.getEmailUsuario();

    this.info.soporte = Constantes.emailSoporte;
    this.info.host = Constantes.hostSoporte;
    this.info.version = Constantes.version;
  }

  cerrar(){

    this.navCtrl.setRoot(InicioPage, {}, { animate: true, direction: 'forward' });
  }
}
