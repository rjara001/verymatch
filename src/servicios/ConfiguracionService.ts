import { configuracionData } from "./dataServicios/configuracionData";
import { palabraData } from "./dataServicios/palabraData";
import { InfoConfiguracion } from "../modelo/InfoConfiguracion";

export class ConfiguracionService {

    SESSION: Number = 2;
    OPCION_SIEMPRE_ACTIVO: Number = 0;
    OPCION_INVERTIR_ORDEN: Number = 1;

    _configuracion: configuracionData;

    constructor() {
        this._configuracion = new configuracionData();
    }
    getAll(idUsuario, callback) {
        return this._configuracion.getAll(idUsuario, callback);
    }

    getDebeActualizar(idUsuario, callback) {
        return new palabraData().getDebeActualizar(idUsuario);
    }

    add(configuracion, callback) {

        let _id = this._configuracion.findById(configuracion.Id, callback);

        if (_id == undefined)
            this._configuracion.add(configuracion);
        else
            this._configuracion.update(configuracion);

    }

    getById(id, callback) {
        //verydb.db.getInstance().grupos.firstOrDefault(callback, "idGrupo='" + idGrupo + "'");
        return this._configuracion.findById(id, callback);

    }

    setOption(idUsuario, position, value, callback) {

        let _ary = this.getAll(idUsuario, callback)
        let info: InfoConfiguracion;

        if (_ary.length == 0)
            info = new InfoConfiguracion(idUsuario);
        else
            info = _ary[0];

        info.Opciones = info.Opciones.replaceAt(position, (value) ? "1" : "0");

        this.add(info, callback);

    }

    getOption(idUsuario, position, callback) {
        //verydb.db.getInstance().grupos.firstOrDefault(callback, "idGrupo='" + idGrupo + "'");
        let _ary = this.getAll(idUsuario, callback)
        let info: InfoConfiguracion;

        if (_ary.length > 0)
            if (_ary[0].Opciones.length > position)
                return parseInt(_ary[0].Opciones[position]) > 0 ? true : false;

        return false;

    }

    crearTabla(callback) {
        this._configuracion.crearTabla(callback);
    }

}