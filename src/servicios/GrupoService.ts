import { BaseService } from "./BaseService";
import { InfoGrupo } from "../modelo/InfoGrupo";
import { grupoData } from "./dataServicios/grupoData";
import { Red } from "./util/red";
import { Constantes } from "../modelo/enums";


export class GrupoService extends BaseService {
    Items: Array<InfoGrupo>;
    private _grupo: grupoData;
    public Info: InfoGrupo;

    // public setGrupo(value: InfoGrupo) {
    //     this._info = value;
    // }

    constructor(idUsuario: string) {
        super(idUsuario);

        this.Items = new Array<InfoGrupo>();
        this._grupo = new grupoData();
        this.Info = new InfoGrupo();
    }

    cargar(): Promise<Array<InfoGrupo>> {

        this.crearTabla();

        return this.getAll();
    }

    getAll(): Promise<Array<InfoGrupo>> {
        return this._grupo.getAll(this.IdUsuario).then(_ => {
            if (_.length == 0) {
                return this.postAPI();
            }
        });

    }

    postAPI():Promise<Array<InfoGrupo>> {
        if (!Red.revisarConexionInternet())
            return Promise.reject("No existe conexion internet.");

        var _url = "[HOST]api/grupo/listar/[ID_USUARIO]";
        _url = _url.replace("[HOST]", Constantes.url).replace("[ID_USUARIO]", this.IdUsuario);

        var xmlhttp = new XMLHttpRequest();

        let _ = this;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //    var _grupo = new APIservicio.grupo(host, idUsuario);
                return _.guardar(xmlhttp.responseText);
            }

        };

        xmlhttp.open("GET", _url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");

        xmlhttp.send();
    }

    guardar(data):Promise<Array<InfoGrupo>> {
        let json = JSON.parse(data);

        this.crearTabla();

        for (var _cont = 0; _cont < json.length; _cont++) {
            var _grupo = this.crearGrupo(json[_cont]);
            _grupo.IdUsuario = this.IdUsuario;
            this.Items.push(_grupo);
            this.add(_grupo);
        }
        return Promise.resolve(this.Items);

    }

    crearGrupo(item) {
        let grupo = new InfoGrupo();
        item.EstadoGrupo = item.Estado;
        grupo.poblar(item);
        return grupo;
    }

    add(grupo: InfoGrupo) {

        this.getById(grupo.Id).then(_ => {
            if (_ == undefined)
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

        return new InfoGrupo();
    }
    getGrupoPorNombre(nombre, callback) {

        this.Items.filter(function (el) {
            if (el.Nombre.toLowerCase() == nombre)
                callback(el);
        });

    }
}