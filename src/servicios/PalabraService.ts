import { palabraData } from "./dataServicios/palabraData";
import { InfoPalabra } from "../modelo/InfoPalabra";
import { porcentajeCentral, porcentajeIzq, porcentajeDer } from "./comparadorService";
import { InfoGrupo } from "../modelo/InfoGrupo";
import { BaseService } from "./BaseService";
import { Red } from "./util/red";
import { Constantes } from "../modelo/enums";

export class PalabraService extends BaseService {
    _info: InfoPalabra;
    Significado: string;
    Nombre: string;

    _palabra: palabraData;
    //idGrupo: string;
    //Grupos: Array<InfoGrupo>;
    public Items: Array<InfoPalabra>;

    constructor(idUsuario: string, idGrupo: number) {
        super(idUsuario);
        this._info = new InfoPalabra(idUsuario, idGrupo);

        //   this.Grupos = new Array<InfoGrupo>();
        this.Items = new Array<InfoPalabra>();
        this._palabra = new palabraData();

    }

    getInfo(): InfoPalabra {
        return this._info;
    }

    getDebeActualizar(idUsuario) {
        return this._palabra.getDebeActualizar(idUsuario);
    }

    getAll(idUsuario: string, idGrupo: number): Promise<InfoPalabra[]> {
        return this._palabra.getAll(idUsuario, idGrupo).then(_ => {
            if (_.length == 0) {
                return this.postAPI();
            }

        });

    }

    postAPI(): Promise<Array<InfoPalabra>> {
        if (!Red.revisarConexionInternet())
            return Promise.reject("No existe conexion internet.");

        var _url = "[HOST]api/palabra/listar";

        _url = _url.replace("[HOST]", Constantes.url);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", _url, true);

        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");

        var param = { IdUsuario: this.IdUsuario, IdGrupo: this._info.IdGrupo }

        let _ = this;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                return _.guardarAll(xmlhttp.responseText);
            }
        }

        xmlhttp.send(Red.JsonToURLEncoded(param));
    }
    guardarAll(data):Promise<Array<InfoPalabra>> {
        let json = JSON.parse(data);

        for (var _cont = 0; _cont < json.length; _cont++) {
            var _palabra = this.crearPalabra(json[_cont]);

            this.add(_palabra);
            this.Items.push(_palabra);
        }

        return Promise.resolve(this.Items);

    }
    
        crearPalabra (item) {
        let palabra = new InfoPalabra(this.IdUsuario, this._info.IdGrupo);
        palabra.poblar(item);
        return palabra;
    }

    add(palabra) {

        let _id = this._palabra.findById(palabra.Id).then(_=>{
            if (_ == undefined)
                this._palabra.add(palabra);
            else
                this._palabra.update(palabra);

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

    getNumeroPendientes() {
        return this._palabra.getNumeroPendientes(this._info.IdUsuario, null);
    }

    Coincide(significado, inversa) {

        var _id = (inversa) ? this.Nombre : this.Significado;
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
        var resumen = {
            Total: 0
            , NumeroRepeticionesActual: 0
            , TotalAprendidas: 0
            , RepetidasConocidas: [0, 0, 0, 0, 0]
            , RepetidasNoConocidas: [0, 0, 0, 0, 0]
            , PendientesPorSubir: 0
            , IdUsuario: this._info.IdUsuario
        };

        resumen.Total = 0;
        resumen.RepetidasNoConocidas[0] = 0;
        resumen.RepetidasNoConocidas[1] = 0;
        resumen.RepetidasNoConocidas[2] = 0;
        resumen.RepetidasNoConocidas[3] = 0;

        resumen.RepetidasConocidas[0] = 0;
        resumen.RepetidasConocidas[1] = 0;
        resumen.RepetidasConocidas[2] = 0;
        resumen.RepetidasConocidas[3] = 0;


        for (var _cont = 0; _cont < this.Items.length; _cont++) {
            resumen.Total++;
            resumen.RepetidasNoConocidas[0] += ((this.Items[_cont].Repeticiones == 0 && !this.Items[_cont].EsConocido) ? 1 : 0);
            resumen.RepetidasNoConocidas[1] += ((this.Items[_cont].Repeticiones == 1 && !this.Items[_cont].EsConocido) ? 1 : 0);
            resumen.RepetidasNoConocidas[2] += ((this.Items[_cont].Repeticiones == 2 && !this.Items[_cont].EsConocido) ? 1 : 0);
            resumen.RepetidasNoConocidas[3] += ((this.Items[_cont].Repeticiones == 3 && !this.Items[_cont].EsConocido) ? 1 : 0);

            resumen.RepetidasConocidas[0] += ((this.Items[_cont].Repeticiones == 0 && this.Items[_cont].EsConocido) ? 1 : 0);
            resumen.RepetidasConocidas[1] += ((this.Items[_cont].Repeticiones == 1 && this.Items[_cont].EsConocido) ? 1 : 0);
            resumen.RepetidasConocidas[2] += ((this.Items[_cont].Repeticiones == 2 && this.Items[_cont].EsConocido) ? 1 : 0);
            resumen.RepetidasConocidas[3] += ((this.Items[_cont].Repeticiones == 3 && this.Items[_cont].EsConocido) ? 1 : 0);

            if (this.Items[_cont].DebeActualizar)
                resumen.PendientesPorSubir++;

        }

        if (resumen.RepetidasNoConocidas[0] > 0)
            resumen.NumeroRepeticionesActual = 0;
        if (resumen.RepetidasNoConocidas[1] > 0 && resumen.RepetidasNoConocidas[0] == 0)
            resumen.NumeroRepeticionesActual = 1;
        if (resumen.RepetidasNoConocidas[2] > 0 && resumen.RepetidasNoConocidas[1] == 0)
            resumen.NumeroRepeticionesActual = 2;
        if (resumen.RepetidasNoConocidas[3] > 0 && resumen.RepetidasNoConocidas[2] == 0)
            resumen.NumeroRepeticionesActual = 3;

        return resumen;
    }

    cargar(): Promise<InfoPalabra[]> {

        this.crearTabla();

        let _promesa = this.getAll(this.IdUsuario, this._info.IdGrupo);

        return _promesa;

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
            var _palabra = new InfoPalabra(this._info.IdUsuario, this._info.IdGrupo);
            _palabra.poblar(json[_cont]);

            this.Items.push(_palabra);
        }
    }

}