import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, ToastController, AlertController } from 'ionic-angular';
import { InfoBase, PageBase } from '../../modelo/InfoBase';
import { globalDataService, Par } from '../../servicios/globalDataService';
import { Constantes } from '../../modelo/enums';
import { InfoEstadoPage } from '../../modelo/infoJugar';
import { InfoGrupo } from '../../modelo/InfoGrupo';
import { PalabraService } from '../../servicios/PalabraService';
import { EstadoService } from '../../servicios/EstadoService';
import { InfoResumen } from '../../modelo/InfoResumen';
import { PalabraAccionService } from '../../servicios/PalabraAccionService';

/**
 * Generated class for the EstadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-estado',
  templateUrl: 'estado.html'
})

export class EstadoPage extends PageBase {
  info: InfoEstadoPage;

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public alertCtrl: AlertController
    , public loadingCtrl: LoadingController
    , public platform: Platform
    , public servicio: EstadoService
    , public toastCtrl: ToastController
    , public chRef: ChangeDetectorRef
    , public globalData:globalDataService) {
    super(alertCtrl, loadingCtrl, toastCtrl, globalData);

    this.info = new InfoEstadoPage();
  }

  ngOnInit() {

    this.show();

    this._inicio().then(() => {
      this.hide();
    }).catch(_=>{
      this.hide()
      this.alerta("Cargando App", "Se presentó un inconveniente al cargar los datos, favor asegurate que tienes conexion de datos");
  });

  }

  _inicio(): Promise<void> {

    this.info.todos = true;

    this.todos();
    this.resumen();

    this.servicio.iniciar(this.getCodigoUsuario());

    if (this.servicio.servicioPalabra.Items.length == 0)
      return this.cargar().then(_ => {
        return this.Refrescar();
      });

    return this.Refrescar();
  }

  private Refrescar(): Promise<void> {
    this.info.grupoInicial = this.servicio.buscarGrupoPorId(this.servicio.servicioGrupo.Info.Id);
    if (this.info.grupoInicial) {
      this._calcularResumen();
      this.info.seleccion = this.info.grupoInicial.Id;
      this.info.grupos = this.servicio.servicioGrupo.Items;
    }
    else
      console.log("No fue cargado grupo inicial");

    return Promise.resolve();
  }

  public cargar(): Promise<void> {

    let idGrupoStorage = this.globalData.getIdGrupo();

    if (idGrupoStorage)
      this.servicio.servicioGrupo.Info.Id = Number(idGrupoStorage);

    return this.servicio.cargar().then(_ => {

      if (this.servicio.servicioGrupo.Info.Id < 0 && this.servicio.servicioGrupo.Items.length > 0)
        this.servicio.servicioGrupo.Info.Id = this.servicio.servicioGrupo.Items[0].Id;

        this.globalData.setIdGrupo(this.servicio.servicioGrupo.Info.Id);

      return Promise.resolve();

    });
  }

  _calcularResumen() {

    this.info.resumen = this.servicio.servicioPalabra.calcularResumen();
    this.info.resumen.PendientesPorSubir = 0;
    this.servicio.servicioPalabra.getNumeroPendientes().then(_ => {
      this.info.resumen.PendientesPorSubir = _;
    });

  }

  resumen() {
    this.info.resumen = new InfoResumen();
    this.info.resumen.Total = 0
    this.info.resumen.NumeroRepeticionesActual = 0
    this.info.resumen.TotalAprendidas = 0
    this.info.resumen.RepetidasConocidas = [0, 0, 0, 0, 0];
    this.info.resumen.RepetidasNoConocidas = [0, 0, 0, 0, 0];
    this.info.resumen.CodigoUsuario = this.getCodigoUsuario();
  }

  todos() {

    this.info.aprendidas = this.info.todos;
    this.info.reconocidas = this.info.todos;
    this.info.conocidas = this.info.todos;
    this.info.descubiertas = this.info.todos;
  }


  recargar(idgrupo) {
    if (!idgrupo)
      return;

      this.globalData.setIdGrupo(idgrupo);
    this.servicio.servicioGrupo.Info.Id = idgrupo;

    this.show();
    this.cargar().then(_ => {
      this.Refrescar();
      this.hide();
    });
  }

  mover() {

    if (!this.info.aprendidas
      && !this.info.reconocidas
      && !this.info.conocidas
      && !this.info.descubiertas) {
      this.alerta("Distribuyendo Resultado..", "Para la redistribuciíon debe seleccionar uno o más niveles");
      return;
    }

    var _mensaje = "Se distribuirán las palabras según el nivel identificado:<ul>"
    if (this.info.aprendidas)
      _mensaje += "<li><br> Se moverán (" + this.info.resumen.RepetidasConocidas[0] + ") palabras al nivel 'aprendidas'</li>"
    if (this.info.reconocidas)
      _mensaje += "<li><br> Se moverán (" + this.info.resumen.RepetidasConocidas[1] + ") palabras al nivel 'básica'</li>"
    if (this.info.conocidas)
      _mensaje += "<li><br> Se moverán (" + this.info.resumen.RepetidasConocidas[2] + ") palabras al nivel 'media'</li>"
    if (this.info.descubiertas)
      _mensaje += "<li><br> Se moverán (" + this.info.resumen.RepetidasConocidas[3] + ") palabras al nivel 'avanzadas'</li>";


    this.confirmar("Distribuyendo Resultado", _mensaje).then(() => {
      this.show();

      let _movimiento = [];

      if (this.info.aprendidas)
        _movimiento.push(this.servicio.accionPalabra.mover(0, "aprendida"));
      if (this.info.reconocidas)
        _movimiento.push(this.servicio.accionPalabra.mover(1, "básica"));
      if (this.info.conocidas)
        _movimiento.push(this.servicio.accionPalabra.mover(2, "media"));
      if (this.info.descubiertas)
        _movimiento.push(this.servicio.accionPalabra.mover(3, "avanzada"));

      this.servicio.servicioPalabra.Items = [];

      Promise.all(_movimiento).then(() => {
        this._inicio().then(_ => {
          //  this.chRef.detectChanges();
          this.hide();
          this.mensaje("Palabras distribuidas satisfactoriamente");
        });

      });


      // _t.cargar().then(() => {
      // _t.Refrescar();
      // _t.hide();
      // _t.mensaje("Palabras distribuidas satisfactoriamente");
      //});
    }).catch(_ => {
      console.log("cancela distribuir.");
    });


  }


  reiniciar() {

    var _mensaje = "Se reiniciará el juego del nivel '" + this.servicio.servicioGrupo.getNombreGrupo() + "'.¿Desea continuar?.";

    this.confirmar("Reiniciando Ciclo..", _mensaje).then(() => {

      this.show();
      this.servicio.accionPalabra.reiniciar().then(() => {

        this._inicio().then(_ => {
          //  this.chRef.detectChanges();
          this.mensaje(_mensaje);
          this.hide()
        });

      });

    }).catch(_ => {
      console.log("cancela reinicio.");
    });
  }


  subir() {

    this.servicio.servicioPalabra.getDebeActualizar(this.getCodigoUsuario()).then(
      palabras => {
        this.confirmar("Subiendo palabras a la nube"
          , "Se subirán '" + palabras.length + "' palabras a la nube. ¿Desea continuar?").then(
          _ => {
            this.show();
            this.servicio.servicioPalabra.restablecerPalabrasParaActualizar(palabras).then(() => {

              this._inicio().then(_ => {
                //  this.chRef.detectChanges();
                this.mensaje("Palabras subidas satisfactoriamente.");
                this.hide();

                this.servicio.servicioPalabra.getNumeroPendientes().then(_ => {
                  this.info.resumen.PendientesPorSubir = _;
                });

              });

            });

          }).catch(_ => {
            console.log("cancela reinicio.");
          });

      });
  }


}


