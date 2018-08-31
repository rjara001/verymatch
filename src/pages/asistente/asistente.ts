import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Keyboard, ToastController, AlertController } from 'ionic-angular';
import { PageBase } from '../../modelo/InfoBase';
import { EstadoService } from '../../servicios/EstadoService';
import { PalabraService } from '../../servicios/PalabraService';
import { Vibration } from '@ionic-native/vibration';
import { InfoAsistente } from '../../modelo/InfoAsistente';
import { JugarPage } from '../jugar/jugar';
import { ConfiguracionService } from '../../servicios/ConfiguracionService';
import { globalDataService } from '../../servicios/globalDataService';
import { InfoPalabra } from '../../modelo/InfoPalabra';
import { EstadoPage } from '../estado/estado';
import { Insomnia } from '@ionic-native/insomnia';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { Observable } from 'rxjs/Observable';
import { Constantes } from '../../modelo/enums';
import { configuracionData } from '../../servicios/dataServicios/configuracionData';

/**
 * Generated class for the AsistentePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-asistente',
  templateUrl: 'asistente.html',
})
export class AsistentePage extends PageBase {

  info: InfoAsistente;
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
    , public toastCtrl: ToastController
    , public insomnia: Insomnia
    , private tts: TextToSpeech
    , private speechrecognizer: SpeechRecognition
    , public globalData:globalDataService
    , public _configuracion:ConfiguracionService) {
    super(alertCtrl, loadingCtrl, toastCtrl, globalData);
    // super(navCtrl
    //   , navParams
    //   , loadingCtrl
    //   , alertCtrl
    //   , keyboard
    //   , servicio
    //   , palabraService
    //   , vibration
    //   , toastCtrl)

    this.info =  new InfoAsistente();

    this.info.botones = { nombreRepasar: 'Repasar', nombreJugar: 'Jugar' };
  }

  ngOnInit() {
    
        this.info.finalizado = false;
        this.info.grupo = this.servicio.servicioGrupo.getNombreGrupo();
        this.palabras = this.servicio.servicioPalabra.Items;
    
  //      var _configuracion = new ConfiguracionService();
    
        this.show();
    
        this._configuracion.getOption(this.getCodigoUsuario()
          , this._configuracion.OPCION_SIEMPRE_ACTIVO).then(_ => {
            this.info.ValidarSiempreActivo = _;
            this._configuracion.getOption(this.getCodigoUsuario()
              , this._configuracion.OPCION_INVERTIR_ORDEN).then(_ => {
                this._inventario.OrdenJuego = _;
                this._inicio();
              });
          });
    
    
    
    
      }

  _inicio() {
    this.info.imgPalabra = (this._inventario.OrdenJuego) ? Constantes.imgEspania : Constantes.imgInglaterra;
    this.info.imgSignificado = (this._inventario.OrdenJuego) ? Constantes.imgInglaterra : Constantes.imgEspania;
    this.info.imgHablado = Constantes.imgHablado;

    this._calcularResumen(this.palabras); // Reactualizar valor numeroRepeticionesActual

    //   _mostrarIcono(0, "");

    this._siguiente();
    this.hide();
  };

  _detener(): void {
    this.info.deseeSeguirJugando = false;

    this.info.botones.nombreRepasar = "Repasar";
    this.info.botones.nombreJugar = "Jugar";

    this.info.finalizado = false;
  }
  ionViewWillUnload() {
    this._detener();
  }

  _puedeObtenerSiguiente() {
    return !this.info.finalizado;
  }

  _repasar() {

    this._detener();

    if (this._puedeObtenerSiguiente()) {
      this.info.deseeSeguirJugando = true;
      this.info.botones.nombreRepasar = "Repasando..";

      this._iniciarRepaso();

    }
    else
      this.mensajeFinalizado();
  }

  _iniciarRepasoAux(): Promise<any> {
    return this._hablarMX(this._getSignificadoActual().then(_ => {
      return setTimeout(this._iniciarRepaso, 3000);
    }));

  }

  _getNombreActual() {
    return (this._inventario.OrdenJuego) ? this._inventario.Item.Significado : this._inventario.Item.Nombre
  }

  _getSignificadoActual() {
    return (this._inventario.OrdenJuego) ? this._inventario.Item.Nombre : this._inventario.Item.Significado;
  }

  _jugar() {

    this._detener();

    if (this._puedeObtenerSiguiente()) {
      this.info.deseeSeguirJugando = true;

      this.info.botones.nombreJugar = "Jugando..";

      this._iniciarJuego();
    }
    else
      this.mensajeFinalizado();
  }

  mensajeFinalizado() {
    {


      var _mensaje = "Felicitaciones el ciclo '" + this.info.grupo + "' ha finalizado, lo siguiente es ir al menú 'Panel de Control' donde podrás distribuir las palabras según donde estas quedaron";

      this.info.finalizado = true;

      this.alerta("Ciclo Finalizado..", _mensaje);
      this.navCtrl.setRoot(EstadoPage);

    }
  }

  _iniciarRepaso() {

    this.insomnia.keepAwake();

    if (this.info.deseeSeguirJugando) {

      this._nuevo();

      if (!this._vacio())
        this._hablarUS(this._getNombreActual()).then(_ => setTimeout(this._iniciarRepasoAux, 3000));
      else {
        this._detener();
        this.insomnia.allowSleepAgain();
      }
    }
  }

  _nuevo() {
    if (!this._inventario.Item)
      this.mensajeFinalizado();
    else {
      this.mensaje("Palabra encolada al siguiente Match");
      if (this._inventario.Item.Repeticiones < 3)
        this._setValor(this._inventario.Item, "Repeticiones", this._inventario.Item.Repeticiones + 1);
      else
        this._setValor(this._inventario.Item, "EsConocido", true);

    }
    this._siguiente();
  }

  _setValor(item, propiedad, valor) {
    item[propiedad] = valor;
    item.DebeActualizar = 1;
    this._guardarCambios(item)

  }

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
    var listadoPalabras = this.palabras.filter(_ => _.Repeticiones == this.info.resumen.NumeroRepeticionesActual && !_.EsConocido);

    if (listadoPalabras.length == 0) {

      listadoPalabras = this.palabras.filter(_ => _.Repeticiones == this.info.resumen.NumeroRepeticionesActual + 1);

      if (listadoPalabras.length > 0)
        this.info.resumen.NumeroRepeticionesActual++;
    }

    if (this.info.resumen.NumeroRepeticionesActual == 3)
      this.mensajeFinalizado();
    else if (listadoPalabras.length == 0)
      this.mensajeFinalizado();
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

  _guardarCambios(item) {
    this.palabraService.add(item);
  }
  _hablarUS(palabra): Promise<any> {

    setTimeout(function () { this._setValorPalabra(palabra) }, 3000);

    return this.tts.speak({
      text: palabra + "..."
      , locale: 'en-GB'
      , rate: 0.6
    });
  }

  _hablarMX(palabra): Promise<any> {
    setTimeout(function () { this._setValorSignificado(palabra) }, 3000);

    return this.tts.speak({
      text: palabra + "..."
      , locale: 'es-ES'
      , rate: 2
    });


  }
  _vacio() {
    return this._getNombreActual() == null || this._getNombreActual().length == 0;
  }

  _iniciarJuego() {
    this.insomnia.keepAwake();

    if (this.info.deseeSeguirJugando) {

      this._nuevo();

      if (!this._vacio())
        this._hablar().then(_ => setTimeout(this._escuchar, 5000));
      else
        this._detener();
    }
    else {
      this._detener();
      this.insomnia.allowSleepAgain();
    }

  }

  _escuchar() {
    if (!this._inventario.OrdenJuego)
      this._clickEscuchar("es-MX").subscribe(_ => this._validar(), error => { this.alerta("", "lamentablemente no es posible reconcer su voz.") });
    else
      this._clickEscuchar("en-US").subscribe(_ => this._validar(), error => { this.alerta("", "lamentablemente no es posible reconcer su voz.") });
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
        this._setValor(this._inventario.Item, "EsConocido", true);

        this._siguiente();

      }

      else {
        this.mensaje("Alcanzó un " + _porcentajeAcierto + "% de acierto");
        this._setFocusSignificado();
      }
    }
  }

  _hablar(): Promise<any> {
    if (!this._inventario.OrdenJuego)
      return this._hablarUS(this._getNombreActual());
    else
      return this._hablarMX(this._getNombreActual());
  }


  _clickEscuchar(language): Observable<any> {

    let options = { language: language, maxMatches: 5, promptString: "Hable ahora" }

    return this.speechrecognizer.startListening(options);
  }
}
