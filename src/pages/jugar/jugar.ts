import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
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
import { Vibration } from '@ionic-native/vibration';
import { BuscadorPage } from '../buscador/buscador';

@IonicPage()
@Component({
  selector: 'page-jugar',
  templateUrl: 'jugar.html',
})

export class JugarPage extends PageBase {

  info: InfoJugar;

  public getInfo(): InfoJugar{
    return this.info;
  }

  palabras: InfoPalabra[];
  _inventario = { 'Item': null, 'Indice': 0, 'Revelado': false, 'CambiosPendientes': [], 'OrdenJuego': true };

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public loadingCtrl: LoadingController
    , public alertCtrl: AlertController
    , public keyboard: Keyboard
    , public servicio: EstadoService
    , public palabraService: PalabraService
    , public vibration: Vibration
    , public toastCtrl: ToastController) {
    super(alertCtrl, loadingCtrl, toastCtrl);

    this.info = new InfoJugar();
  }

  ngOnInit() {

    this.info.puedeEditar = false;
    this.info.finalizado = false;
    this.info.grupo = this.servicio.servicioGrupo.getNombreGrupo();
    this.palabras = this.servicio.servicioPalabra.Items;

    var _configuracion = new ConfiguracionService();

    this.show();

    _configuracion.getOption(globalDataService.getCodigoUsuario()
      , _configuracion.OPCION_SIEMPRE_ACTIVO).then(_ => {
        this.info.ValidarSiempreActivo = _;
        _configuracion.getOption(globalDataService.getCodigoUsuario()
          , _configuracion.OPCION_INVERTIR_ORDEN).then(_ => {
            this._inventario.OrdenJuego = _;
            this._inicio();
          });
      });




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
      if (this.keyboard)
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

  mensajeFinalizado(felicita) {
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

    this.info.resumen = this.palabraService.calcularResumen();
    this.info.NivelRepeticiones = this.info.resumen.NumeroRepeticionesActual;
    this.info.RepetidasConocidas = this.info.resumen.RepetidasConocidas[this.info.resumen.NumeroRepeticionesActual];
    this.info.RepetidasNoConocidas = this.info.resumen.RepetidasNoConocidas[this.info.resumen.NumeroRepeticionesActual];

    if (this.info.NivelRepeticiones < 3) {
      this.info.RepetidasColaConocidas = this.info.resumen.RepetidasConocidas[this.info.resumen.NumeroRepeticionesActual + 1];
      this.info.RepetidasColaNoConocidas = this.info.resumen.RepetidasNoConocidas[this.info.resumen.NumeroRepeticionesActual + 1];
    }

  }

  _validar() {

    var _valor = this.info.SignificadoPalabra;

    this.palabraService.Nombre = this._getNombreActual();
    this.palabraService.Significado = this._getSignificadoActual();

    if (this._inventario.Revelado && !this.info.ValidarSiempreActivo)
      this.mensaje("No!, sin trampa..");
    else {
      var _porcentajeAcierto = this.palabraService.Coincide(_valor, this._inventario.OrdenJuego);

      if (_porcentajeAcierto == 100) {
        this.mensaje("Alcanzó un " + _porcentajeAcierto + "% de acierto");
        this._setValor(this._inventario.Item, "EsConocido", 1);

        this._siguiente();

        this._mostrarIcono(1);
      }

      else {
        this.mensaje("Alcanzó un " + _porcentajeAcierto + "% de acierto");
        this._setFocusSignificado();
        this._mostrarIcono(2);
        this.vibrate(200);
      }
    }
  }

  vibrate(ms) {
    this.vibration.vibrate(ms);
  };
  _mostrarIcono(estado) {
    switch (estado) {
      case 1:
        this.info.mostrarValido = true;
        this.info.mostrarNoValido = false;

        setTimeout(() => { this._mostrarIcono(0) }, 3 * 1000);

        break;
      case 2:
        this.info.mostrarValido = false;
        this.info.mostrarNoValido = true;

        setTimeout(() => { this._mostrarIcono(0) }, 2 * 1000);
        break;
      default:
        this.info.mostrarValido = false;
        this.info.mostrarNoValido = false;
        break;
    }


  }
  _setValor(item, propiedad, valor) {
    item[propiedad] = valor;
    item.DebeActualizar = 1;
    this._guardarCambios(item)

  }

  _guardarCambios(item) {
    this.palabraService.add(item);
  }


  _ver() {
    //   _mostrarIcono(0, "");
    this._inventario.Revelado = true;
    this.info.puedeEditar = true;
    this._setValorSignificado(true);

  }

  _nuevo() {
    if (!this._inventario.Item)
      this.mensajeFinalizado(false);
    else {
      this.mensaje("Palabra encolada al siguiente Match");
      if (this._inventario.Item.Repeticiones < 3)
        this._setValor(this._inventario.Item, "Repeticiones", this._inventario.Item.Repeticiones + 1);
      else
        this._setValor(this._inventario.Item, "EsConocido", 1);

    }


    this._siguiente();

  }


  _revisar() {
    var _mensaje = "¿Desea revisar significado?"

    if (this.info.puedeEditar)
      this.confirmar("Revisando significado..", _mensaje)
        .then(function (res) {
          if (res)
            this.navCtrl.setRoot(BuscadorPage, {}, { animate: true, direction: 'forward' });
        });
  }
}
