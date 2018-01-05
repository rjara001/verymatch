import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { PalabraService } from '../../servicios/PalabraService';
import { PageBase } from '../../modelo/InfoBase';
import { globalDataService } from '../../servicios/globalDataService';

/**
 * Generated class for the BuscadorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-buscador',
  templateUrl: 'buscador.html',
})
export class BuscadorPage extends PageBase {

  info = { search: '', palabras: [] };

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public servicio: PalabraService
    , public alertCtrl: AlertController
    , public loadingCtrl: LoadingController
    , public toastCtrl: ToastController
    , public globalData:globalDataService) {
      super(alertCtrl, loadingCtrl, toastCtrl, globalData);

  }

  ngOnInit(){
    //this.info.grupo = $rootScope.globals.grupo.Nombre;
    this.show();
    this._reiniciar();
    this.hide();
  }

  _reiniciar(){
    this.info.palabras = this.servicio.Items;
    this.info.search = this.servicio._info.Nombre;
  }
  setFilteredItems() {
    this.show();

    this.info.palabras = this.servicio.Items.filter(_ => {
      if (_.Nombre.indexOf(this.info.search) >= 0)
        return _;
    });

    this.hide();
  }
  google() {
    window.open("https://translate.google.com/?q=" + this.info.search + "&sl=en&tl=es#en/es/" + this.info.search, "_blank");
  }

  bing() {
    window.open("https://translate.google.com/?q=" + this.info.search + "&sl=en&tl=es#en/es/" + this.info.search, "_blank");
  }

  _guardarCambios(item) {
    let _item = this.info.palabras.filter(_=>{
      if (_.Id == item.Id)
        return item;
    });

    // if (_item)
    //   _item[0].Significado = this.

    this.servicio._palabra.add(item);

  }

  cambiar(item) {

    this.showPrompt('Cambiar significado', 'Palabra:' + item.Nombre)
      .then(function (res) {
        //_guardar cambio;
        if (res && res.length > 0) {
          item.Significado = res.toLowerCase();
          item.DebeActualizar = true;
          this._guardarCambios(item);
        }


      }).catch(_=>{
        console.log("problemas al guardar nuevo significado desde el buscador '" + item.Nombre + "'");
      });
  }

  showPrompt(titulo: string, mensaje: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let prompt = this.alertCtrl.create({
        title: titulo,
        message: mensaje,
        inputs: [
          {
            name: 'Nuevo significado',
            placeholder: 'Significado'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: reject
          },
          {
            text: 'Guardar',
            handler: resolve
          }
        ]
      });
      prompt.present();
    });
  }
}
