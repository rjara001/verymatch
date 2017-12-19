import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { InfoBase, PageBase } from '../../modelo/InfoBase';
import { globalDataService, Par } from '../../servicios/globalDataService';
import { Constantes } from '../../modelo/enums';
import { InfoEstadoPage } from '../../modelo/infoJugar';
import { InfoGrupo } from '../../modelo/InfoGrupo';
import { PalabraService } from '../../servicios/PalabraService';
import { EstadoService } from '../../servicios/EstadoService';

/**
 * Generated class for the EstadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-estado',
  templateUrl: 'estado.html',
})
export class EstadoPage extends PageBase {
  info: InfoEstadoPage;

  servicio: EstadoService = null;

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , public alertCtrl: AlertController
    , public loadingCtrl: LoadingController
    , public platform: Platform) {
    super(alertCtrl, loadingCtrl);

    this.info = new InfoEstadoPage();
  }

  ngOnInit() {

    this.show();

    this._inicio().then(_ => this.hide());

  }

  _inicio(): Promise<void> {
    this.servicio = new EstadoService(this.getIdUsuario(),this.getIdGrupo());

    if (this.servicio.servicioPalabra.Items.length == 0)
      return this.cargarPalabras().then(_ => {
        if (this.info.grupoInicial)
          this.info.seleccion = this.info.grupoInicial.Id;
        return Promise.resolve();
      });
    else {
      this._calcularResumen();
    }
    return Promise.resolve();
  }

  public cargarPalabras(): Promise<void> {
    //  $scope.show();
    let idGrupoStorage = globalDataService.getIdGrupo();

    if (idGrupoStorage)
      this.servicio.servicioGrupo.Info.Id = Number(idGrupoStorage);

    return this.servicio.cargar().then(_ => {

      // globalDataService.setData(new Par("grupos", this.servicio.servicioGrupo.getGrupos()));

      // globalDataService.setData(new Par("palabras", this.servicio.servicioPalabra.getPalabras()));

      if (this.servicio.IdGrupo < 0 && this.servicio.servicioGrupo.Items.length > 0)
        this.servicio.IdGrupo = this.servicio.servicioGrupo.Items[0].Id;

      globalDataService.setIdGrupo(this.servicio.IdGrupo);

      this.info.grupoInicial = this.servicio.buscarGrupoPorId(this.servicio.IdGrupo);
      this.info.grupos = this.servicio.servicioGrupo.Items;

      //TODO: Revisar utilidad
      // globalDataService.setData(new Par("grupo", this.info.grupoInicial));

      this._calcularResumen();

      return Promise.resolve();

    });

    //  $scope.$apply(function () {


  }

  _calcularResumen() {

    this.info.resumen = this.servicio.servicioPalabra.calcularResumen();

    this.info.resumen.PendientesPorSubir = this.servicio.servicioPalabra.getNumeroPendientes();

  }


}

