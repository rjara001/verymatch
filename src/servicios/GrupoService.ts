import { BaseService } from "./BaseService";
import { InfoGrupo } from "../modelo/InfoGrupo";
import { grupoData } from "./dataServicios/grupoData";
import { Red } from "./util/red";
import { Constantes } from "../modelo/enums";
import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';

@Injectable()
export class GrupoService extends BaseService {
    Items: Array<InfoGrupo>;
   // private _grupo: grupoData;
    public Info: InfoGrupo;

    // public setGrupo(value: InfoGrupo) {
    //     this._info = value;
    // }

    constructor(public http: Http, public _grupo:grupoData) {
        super();
        //  this.IdUsuario = idUsuario;
        this.Items = new Array<InfoGrupo>();
        //this._grupo = new grupoData();
        this.Info = new InfoGrupo();
    }

    getNombreGrupo() {
        if (this.Info.Nombre.length == 0)
            this.Info.Nombre = this.Items.filter(_ => _.Id == this.Info.Id)[0].Nombre;

        return this.Info.Nombre;
    }
    cargar(): Promise<boolean> {

        this.crearTabla();

        return this.getAll().then(_ => {
            this.Items = _;

            return Promise.resolve(true);
        });


    }

    getAll(): Promise<Array<InfoGrupo>> {
        return this._grupo.getAll(this.CodigoUsuario).then(a => {
            if (a.length == 0) {
                return this.postAPI().map(_ => {
                    return _.map(i => {
                        i.CodigoUsuario = this.CodigoUsuario;
                        this.add(i);
                        
                        return i;
                    });

                }).toPromise<Array<InfoGrupo>>();
            }

            return a;
        });

    }

    postAPI(): Observable<Array<InfoGrupo>> {
        if (!Red.revisarConexionInternet())
            return Observable.throw("No existe conexion internet.");

        var _url = "[HOST]api/grupo/listar/[ID_USUARIO]";
        _url = _url.replace("[HOST]", Constantes.url).replace("[ID_USUARIO]", String(this.CodigoUsuario));


        return this.http.get(_url)
            .map(_ => {
                return _.json().map(i => {
                    return new InfoGrupo(i);
                })
            });

    }


    add(grupo: InfoGrupo) {

        this.getById(grupo.Id).then(_ => {
            if (!_) // si no existe, guardo
                this._grupo.add(grupo);
        });

    }
    deleteGrupo(id, callback) {
        //var db = verydb.db.getInstance();
        //db.grupos.removeByWhere("id=" + id, callback);
    }
    deleteAll(callback) {
        //var db = verydb.db.getInstance();
        //var listado = db.grupos.getAll();
        //for (var cont = 0; cont < listado.lenght;cont++)
        //    db.grupos.removeByWhere("id=" + listado[cont], callback);
    }
    update(grupo, callback) {
        //var db = verydb.db.getInstance();
        //db.grupos.where("id=" + grupo.id).firstOrDefault(function (dbGrupo) {
        //    dbPalabra.updateFrom(grupo);
        //    db.grupos.update(dbGrupo);
        //    db.saveChanges(function () {
        //        grupo.lastUpdatedTime = dbGrupo.lastUpdatedTime;
        //        callback && callback();
        //    });
        //});
    }
    get(id, callback) {
        //verydb.db.getInstance().grupos.firstOrDefault(callback, "id=" + id);
    }

    getById(id): Promise<InfoGrupo> {
        //verydb.db.getInstance().grupos.firstOrDefault(callback, "idGrupo='" + idGrupo + "'");
        return this._grupo.findById(id);

    }
    crearTabla() {
        this._grupo.crearTabla();
    }

    getIdGrupoPorDefecto(): InfoGrupo {

        let _listado = this.Items.filter(function (el) {
            if (el.EstadoGrupo == 2)
                return el.Id;
        });

        if (_listado.length > 0)
            return _listado[0];

        return this.Items[0];
    }

    getGrupoPorNombre(nombre): InfoGrupo {

        let _respuesta = this.Items.filter(_ => _.Nombre.toLowerCase() == nombre);
        if (_respuesta.length > 0)
            return _respuesta[0];

        return new InfoGrupo();

    }
}