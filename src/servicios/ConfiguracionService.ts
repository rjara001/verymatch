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
    getAll(codigoUsuario):Promise<InfoConfiguracion[]> {
        return this._configuracion.getAll(codigoUsuario);
    }

    getDebeActualizar(codigoUsuario, callback) {
        return new palabraData().getDebeActualizar(codigoUsuario);
    }

    add(configuracion): Promise<void> {

        return this._configuracion.findById(configuracion.Id).then(_ => {

            if (_ == undefined)
                return this._configuracion.add(configuracion);
            else
                return this._configuracion.update(configuracion);
        });

    }

    getById(id): Promise<InfoConfiguracion> {
        //verydb.db.getInstance().grupos.firstOrDefault(callback, "idGrupo='" + idGrupo + "'");
        return this._configuracion.findById(id);

    }

    setOption(codigoUsuario, position, value): Promise<void> {

        return this.getAll(codigoUsuario).then(_ary => {

            let info: InfoConfiguracion;

            if (_ary.length == 0)
                info = new InfoConfiguracion(codigoUsuario);
            else
                info = _ary[0];

            info.Opciones = this.setCharAt(info.Opciones, position, (value) ? "1" : "0");

            return this.add(info);
        });

    }
    setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }

    getOption(codigoUsuario, position):Promise<boolean> {
        //verydb.db.getInstance().grupos.firstOrDefault(callback, "idGrupo='" + idGrupo + "'");
        return this.getAll(codigoUsuario).then(_ary=>{
            let info: InfoConfiguracion;
            
                    if (_ary.length > 0)
                        if (_ary[0].Opciones.length > position)
                            return parseInt(_ary[0].Opciones[position]) > 0 ? true : false;
            
                    return false;
            
            
        });
    }

    crearTabla(callback) {
        this._configuracion.crearTabla(callback);
    }

}