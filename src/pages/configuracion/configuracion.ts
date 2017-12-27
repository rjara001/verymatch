import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { globalDataService, Par } from '../../servicios/globalDataService';
import { ConfiguracionService } from '../../servicios/ConfiguracionService';
import { PageBase } from '../../modelo/InfoBase';
import { Constantes } from '../../modelo/enums';

/**
 * Generated class for the ConfiguracionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage extends PageBase {

  info = { BotonValidarSiempreActivo: true, InvertirOrdenJuego: true, TextoOrdenJuego: "" };

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public globalData: globalDataService
    , public configuracion: ConfiguracionService
    , public alertCtrl: AlertController
    , public loadingCtrl: LoadingController
    , public toastCtrl: ToastController) {
    super(alertCtrl, loadingCtrl, toastCtrl, globalData)
  }

  ngOnInit() {


    this._inicio();

  }

  _inicio() {
    this._textoOrdenJuego();

    this.configuracion.crearTabla().then(() => {

      this.configuracion.getOption(this.getCodigoUsuario(), this.configuracion.OPCION_SIEMPRE_ACTIVO).then(_ => {
        this.info.BotonValidarSiempreActivo = _;
      });

      this.configuracion.getOption(this.getCodigoUsuario(), this.configuracion.OPCION_INVERTIR_ORDEN).then(_ => {
        this.info.InvertirOrdenJuego = _;
      });
    });
  }

  guardar() {

    this._textoOrdenJuego();

    this.configuracion.setOption(this.getCodigoUsuario(), this.configuracion.OPCION_SIEMPRE_ACTIVO, this.info.BotonValidarSiempreActivo).then(_ => {
      this.configuracion.setOption(this.getCodigoUsuario(), this.configuracion.OPCION_INVERTIR_ORDEN, this.info.InvertirOrdenJuego).then(_ => { });
    });

  }

  _textoOrdenJuego() {
    if (this.info.InvertirOrdenJuego)
      this.info.TextoOrdenJuego = "Invertir Orden (Español/Ingles)";
    else
      this.info.TextoOrdenJuego = "Invertir Orden (Ingles/Español)";
  }


}
