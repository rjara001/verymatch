import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { InfoPalabra } from '../../modelo/InfoPalabra';
import { InfoJugar } from '../../modelo/infoJugar';
import { InfoBase, PageBase } from '../../modelo/InfoBase';
import { ConfiguracionService } from '../../servicios/ConfiguracionService';
import { globalDataService } from '../../servicios/globalDataService';
import { Constantes } from '../../modelo/enums';
import { PalabraService } from '../../servicios/PalabraService';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { EstadoService } from '../../servicios/EstadoService';
import { Keyboard } from 'ionic-angular/platform/keyboard';

@IonicPage()
@Component({
  selector: 'page-jugar',
  templateUrl: 'jugar.html',
})

export class JugarPage extends PageBase {

  info: InfoJugar;
  servicio: EstadoService = null;

  palabras: InfoPalabra[];
  _inventario = { 'Item': null, 'Indice': 0, 'Revelado': false, 'CambiosPendientes': [], 'OrdenJuego': true };

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public loadingCtrl: LoadingController
    , public alertCtrl: AlertController
   , public keyboard: Keyboard) {
      super(alertCtrl, loadingCtrl);

  }

  ngOnInit() {

    this.info.puedeEditar = false;
    this.info.finalizado = false;
    this.info.grupo = this.servicio.servicioGrupo.Info.Nombre;
    this.palabras = this.servicio.servicioPalabra.Items;

    var _configuracion = new ConfiguracionService();

    this.show();

    this.info.ValidarSiempreActivo = _configuracion.getOption(globalDataService.getIdUsuario()
      , _configuracion.OPCION_SIEMPRE_ACTIVO
      , null);

    this._inventario.OrdenJuego = _configuracion.getOption(globalDataService.getIdUsuario()
      , _configuracion.OPCION_INVERTIR_ORDEN
      , null);

    this._inicio();
  }

  _inicio() {
    this.info.imgPalabra = (this._inventario.OrdenJuego) ? Constantes.imgEspania : Constantes.imgInglaterra;
    this.info.imgSignificado = (this._inventario.OrdenJuego) ? Constantes.imgInglaterra : Constantes.imgEspania;

    this._calcularResumen(this.palabras); // Reactualizar valor numeroRepeticionesActual

    //   _mostrarIcono(0, "");

    this._siguiente();
    this.hide();
  };

  _siguiente() {
    this._inventario.Revelado = false;
    this.info.puedeEditar = false;

    this._random();

    this._setFocusSignificado();
    //      $("#lnkCorregir").hide();

  }
  
  _setFocusSignificado() {
    setTimeout(function () {
        document.getElementById('txtSignificado').focus();
        this.keyboard.show();
    }, 750);
   
}

  _random() {
    var listadoPalabras = this.palabras.filter(_ => _.Repeticiones == this.info.resumen.NumeroRepeticionesActual);

    if (listadoPalabras.length == 0) {

      listadoPalabras = this.palabras.filter(_ => _.Repeticiones == this.info.resumen.NumeroRepeticionesActual + 1);

      if (listadoPalabras.length > 0)
        this.info.resumen.NumeroRepeticionesActual++;
    }

    if (this.info.resumen.NumeroRepeticionesActual == 3)
      this.mensajeFinalizado(true);
    else if (listadoPalabras.length == 0)
      this.mensajeFinalizado(false);
    else {
      this.info.finalizado = false;
      var indice = Math.floor(Math.random() * listadoPalabras.length);

      this._inventario.Item = listadoPalabras[indice];
      this._inventario.Indice = indice;

      if (this._inventario.Item != null) {
        this._setValorPalabra(true);
      }

      this._setValorSignificado(false);

      this._calcularResumen(this.palabras);

    }
  }

  _setValorSignificado(valor) {
    if (valor)
        this.info.SignificadoPalabra = this._getSignificadoActual();
    else
    this.info.SignificadoPalabra = "";
}
    
  _setValorPalabra(valor) {
    if (valor)
        this.info.NombrePalabra = this._getNombreActual();
    else
      this.info.NombrePalabra = "";
}

_getNombreActual() {
  return (this._inventario.OrdenJuego) ? this._inventario.Item.Significado : this._inventario.Item.Nombre
}

_getSignificadoActual() {
  return (this._inventario.OrdenJuego) ? this._inventario.Item.Nombre : this._inventario.Item.Significado;
}

  mensajeFinalizado(felicita){
    var _mensaje = '';
    
            if (felicita)
                _mensaje = "Felicitaciones, has completado el ciclo '" + this.info.grupo + "', lo siguiente es ir al menú 'Panel de Control' donde podrás distribuir las palabras según donde estas quedaron";
            else
                _mensaje = "Ciclo '" + this.info.grupo + "' completo, lo siguiente es ir al menú 'Panel de Control' donde podrás reiniciar el ciclo";
    
            this.info.finalizado = true;
    
            let alert = this.alertCtrl.create({
              title: 'Ciclo Finalizado!',
              subTitle: _mensaje,
              buttons: ['OK']
            });
            alert.present();

            this.navCtrl.popToRoot();

            
  }

  _calcularResumen(palabras: Array<InfoPalabra>) {
    let palabraService: PalabraService;

    this.info.resumen = palabraService.calcularResumen();
    this.info.NivelRepeticiones = this.info.resumen.NumeroRepeticionesActual;
    this.info.RepetidasConocidas = this.info.resumen.RepetidasConocidas[this.info.resumen.NumeroRepeticionesActual];
    this.info.RepetidasNoConocidas = this.info.resumen.RepetidasNoConocidas[this.info.resumen.NumeroRepeticionesActual];

    if (this.info.NivelRepeticiones < 3) {
      this.info.RepetidasColaConocidas = this.info.resumen.RepetidasConocidas[this.info.resumen.NumeroRepeticionesActual + 1];
      this.info.RepetidasColaNoConocidas = this.info.resumen.RepetidasNoConocidas[this.info.resumen.NumeroRepeticionesActual + 1];
    }

  }
}
