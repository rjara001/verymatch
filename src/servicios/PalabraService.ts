import { palabraData } from "./dataServicios/palabraData";
import { InfoPalabra } from "../modelo/InfoPalabra";
import { porcentajeCentral, porcentajeIzq, porcentajeDer } from "./comparadorService";
import { InfoGrupo } from "../modelo/InfoGrupo";
import { BaseService } from "./BaseService";
import { Red } from "./util/red";
import { Constantes } from "../modelo/enums";
import { Observable } from "rxjs/Observable";
import { RequestOptions, Http } from "@angular/http";
import { Headers } from '@angular/http';
import { Injectable, NgModule } from "@angular/core";
import { InfoResumen } from "../modelo/InfoResumen";
import { _ParseAST } from "@angular/compiler";

@Injectable()
export class PalabraService extends BaseService {
    _info: InfoPalabra;
    Significado: string;
    Nombre: string;

    _palabra: palabraData;
    //idGrupo: string;
    //Grupos: Array<InfoGrupo>;
    public Items: Array<InfoPalabra>;

    constructor(public http: Http) {
        super();

        //   this.Grupos = new Array<InfoGrupo>();
        this.Items = new Array<InfoPalabra>();
        this._palabra = new palabraData();

    }

    iniciar(codigoUsuario: number, idGrupo: number) {
        this._info = new InfoPalabra(codigoUsuario, idGrupo);
        this.CodigoUsuario = codigoUsuario;
    }

    getInfo(): InfoPalabra {
        return this._info;
    }

    getDebeActualizar(codigoUsuario: number): Promise<InfoPalabra[]> {
        return this._palabra.getDebeActualizar(codigoUsuario);
    }

    getAll(codigoUsuario: number, idGrupo: number): Promise<InfoPalabra[]> {

        return this._palabra.getAll(codigoUsuario, idGrupo).then(a => {
            if (a.length == 0) {
                return this.postAPI().map(_ => {
                    return _.map(i => {
                        this.add(i);
                        return i;
                    });

                }).toPromise<Array<InfoPalabra>>();
            }

            return a;
        });
    }

    postAPI(): Observable<InfoPalabra[]> {
        if (!Red.revisarConexionInternet())
            return Observable.throw("No existe conexion internet.");

        var _url = "[HOST]api/palabra/listar".replace("[HOST]", Constantes.url).replace("[ID_USUARIO]", String(this.CodigoUsuario));

        var param = { IdUsuario: this.CodigoUsuario, IdGrupo: this._info.IdGrupo }

        var _postData = JSON.stringify(param);

        return this.http.post(_url
            , _postData
            , new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) }))
            .map(_ => {
                return _.json().map(i => {
                    let _palabra: InfoPalabra = new InfoPalabra(i.IdUsuario, i.IdGrupo);
                    _palabra.poblar(i);
                    
                    return _palabra;
                })
            });

    }
    subirAPI(palabras:InfoPalabra[]): Promise<any> {

        if (!Red.revisarConexionInternet())
            return Promise.reject("No existe conexion internet.");

        var _url = "[HOST]api/palabra/guardarpalabras".replace("[HOST]", Constantes.url);

        var _parametro = JSON.stringify(palabras);

        return this.http.post(_url
            , _parametro
            , new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) }))
            .toPromise();
        
            // _aux.toPromise().then(_=>{
            //     return Promise.resolve(_);
            // })
            // .catch(_=>{
            //     console.log(_);
            //     Promise.reject(_);
            // });

    }

    crearPalabra(item) {
        let palabra = new InfoPalabra(this.CodigoUsuario, this._info.IdGrupo);
        palabra.poblar(item);
        return palabra;
    }

    add(palabra: InfoPalabra): Promise<void> {

        return this._palabra.findById(palabra.Id).then(_ => {
            if (_ == undefined)
                return this._palabra.add(palabra);
            else
                return this._palabra.update(palabra);
        });

    }

    getById(id) {
        //verydb.db.getInstance().grupos.firstOrDefault(callback, "idGrupo='" + idGrupo + "'");
        return this._palabra.findById(id);

    }

    crearTabla() {
        this._palabra.crearTabla();
    }

    getSignificadoRefinado(significado) {
        return this.eliminarAcento(significado);
    }

    eliminarAcento(palabra) {
        return palabra.trim()
            .toLowerCase()
            .replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ú", "u");
    }

    getNumeroPendientes(): Promise<number> {
        return this._palabra.getNumeroPendientes(this._info.getCodigoUsuario()).then(_ => {
            return _;
        });
    }

    Coincide(significado, inversa) {

        var _id = this.Significado;
        var _valor = significado;

        if (_id == this.getSignificadoRefinado(significado))
            return 100;

        var _largoId = _id.length;
        var _largoValor = _valor.length;

        if (_largoId == 0 || _largoValor == 0)
            return 0;

        if (_largoId > _largoValor)
            return this._calcularPorcentaje(_id, _valor);
        else
            return this._calcularPorcentaje(_valor, _id);

    }

    _calcularPorcentaje(id, valor) {

        var _porcentajeCentral = (new porcentajeCentral(id, valor)).Calcular();
        var _porcentajeIzq = (new porcentajeIzq(id, valor)).Calcular();
        var _porcentajeDer = (new porcentajeDer(id, valor)).Calcular();

        if (_porcentajeCentral > _porcentajeIzq) {
            if (_porcentajeCentral > _porcentajeDer)
                return _porcentajeCentral;
            else
                return _porcentajeDer;
        }
        else
            if (_porcentajeIzq > _porcentajeDer)
                return _porcentajeIzq;
            else
                return _porcentajeDer;

        //return _porcentajeCentral;
    }

    calcularResumen() {
        // var resumen = {
        //     Total: 0
        //     , NumeroRepeticionesActual: 0
        //     , TotalAprendidas: 0
        //     , RepetidasConocidas: [0, 0, 0, 0, 0]
        //     , RepetidasNoConocidas: [0, 0, 0, 0, 0]
        //     , PendientesPorSubir: 0
        //     , IdUsuario: this._info.IdUsuario
        // };
        this._info.Resumen = new InfoResumen();
        this._info.Resumen.Total = 0;
        this._info.Resumen.RepetidasNoConocidas[0] = 0;
        this._info.Resumen.RepetidasNoConocidas[1] = 0;
        this._info.Resumen.RepetidasNoConocidas[2] = 0;
        this._info.Resumen.RepetidasNoConocidas[3] = 0;

        this._info.Resumen.RepetidasConocidas[0] = 0;
        this._info.Resumen.RepetidasConocidas[1] = 0;
        this._info.Resumen.RepetidasConocidas[2] = 0;
        this._info.Resumen.RepetidasConocidas[3] = 0;


        for (var _cont = 0; _cont < this.Items.length; _cont++) {
            this._info.Resumen.Total++;
            this._info.Resumen.RepetidasNoConocidas[0] += ((this.Items[_cont].Repeticiones == 0 && !this.Items[_cont].EsConocido) ? 1 : 0);
            this._info.Resumen.RepetidasNoConocidas[1] += ((this.Items[_cont].Repeticiones == 1 && !this.Items[_cont].EsConocido) ? 1 : 0);
            this._info.Resumen.RepetidasNoConocidas[2] += ((this.Items[_cont].Repeticiones == 2 && !this.Items[_cont].EsConocido) ? 1 : 0);
            this._info.Resumen.RepetidasNoConocidas[3] += ((this.Items[_cont].Repeticiones == 3 && !this.Items[_cont].EsConocido) ? 1 : 0);

            this._info.Resumen.RepetidasConocidas[0] += ((this.Items[_cont].Repeticiones == 0 && this.Items[_cont].EsConocido) ? 1 : 0);
            this._info.Resumen.RepetidasConocidas[1] += ((this.Items[_cont].Repeticiones == 1 && this.Items[_cont].EsConocido) ? 1 : 0);
            this._info.Resumen.RepetidasConocidas[2] += ((this.Items[_cont].Repeticiones == 2 && this.Items[_cont].EsConocido) ? 1 : 0);
            this._info.Resumen.RepetidasConocidas[3] += ((this.Items[_cont].Repeticiones == 3 && this.Items[_cont].EsConocido) ? 1 : 0);

            if (this.Items[_cont].DebeActualizar)
                this._info.Resumen.PendientesPorSubir++;

        }

        if (this._info.Resumen.RepetidasNoConocidas[0] > 0)
            this._info.Resumen.NumeroRepeticionesActual = 0;
        if (this._info.Resumen.RepetidasNoConocidas[1] > 0 && this._info.Resumen.RepetidasNoConocidas[0] == 0)
            this._info.Resumen.NumeroRepeticionesActual = 1;
        if (this._info.Resumen.RepetidasNoConocidas[2] > 0 && this._info.Resumen.RepetidasNoConocidas[1] == 0)
            this._info.Resumen.NumeroRepeticionesActual = 2;
        if (this._info.Resumen.RepetidasNoConocidas[3] > 0 && this._info.Resumen.RepetidasNoConocidas[2] == 0)
            this._info.Resumen.NumeroRepeticionesActual = 3;

        return this._info.Resumen;
    }

    cargar(idGrupo: number): Promise<boolean> {

        this._info.IdGrupo = idGrupo;

        this.crearTabla();

        return this.getAll(this.CodigoUsuario, this._info.IdGrupo).then(_ => {
            this.Items = _;
            // .map(_=>{
            //     // let _palabra = new InfoPalabra(this.CodigoUsuario, this._info.IdGrupo);
            //     // _palabra.poblar(_);
            //     return _;
            // });

            return true;
        });

    }

    // _getAll(idGrupo: string, idUsuario: string):Promise<boolean> {

    //     return this.getAll(idGrupo, idUsuario).then(_ => {
    //         this.Palabras = _ as Array<InfoPalabra>;

    //         if (this.Palabras == null || this.Palabras.length == 0)
    //             return this.postAPI(null);
    //     });
    // }


    poblarPalabras(data: string) {
        let json = JSON.parse(data);

        for (var _cont = 0; _cont < json.length; _cont++) {
            var _palabra = new InfoPalabra(this._info.getCodigoUsuario(), this._info.IdGrupo);
            _palabra.poblar(json[_cont]);

            this.Items.push(_palabra);
        }
    }

    private guardarPalabrasParaActualizar(palabras):Promise<void> {

        let promesas = []; // contador permite asegurar que una vez que termine el proceso pueda avanzar
        for (var _cont = 0; _cont < palabras.length; _cont++) {
            var item = palabras[_cont];
            item.DebeActualizar = 0;
            promesas.push(this.add(item));
        }
        return Promise.all(promesas).then(_=>{
            return Promise.resolve();
        });
    }

    restablecerPalabrasParaActualizar(palabras):Promise<any> {

        // var _palabrasParaActualizar = [];

        // this.Items.filter(function (item) {
        //     if (item.DebeActualizar > 0)
        //         _palabrasParaActualizar.push(item);
        // })

        if (palabras.length > 0) {
            return this.subirAPI(palabras).then(() => {
                return this.guardarPalabrasParaActualizar(palabras);
            }).catch(error=>{
                console.log(error);
                return Promise.reject(error);
            });

        }
        else
            return Promise.resolve();
    }

}