import { InfoConfiguracion } from "../../modelo/InfoConfiguracion";
import { BaseDataService } from "./BaseDataService";

export class configuracionData extends BaseDataService {


    TEXT_CREATE: string = "create table if not exists Configuracion (Id text, Opciones text, IdUsuario text)";
    TEXT_INSERT: string = "INSERT INTO tasks(title, completed) VALUES(?,?)";
    TEXT_UPDATE: string = "update Configuracion set Opciones=?, IdUsuario=? where Id=?";
    TEXT_TRAER_POR_ID: string = "select Id, Opciones, IdUsuario from Configuracion where Id = ?";
    TEXT_TRAER_TODOS: string = "select Id, Opciones, IdUsuario from Configuracion where idUsuario = ?";

    constructor() {
        super();
    }

    crearTabla(callback: () => void) {
        return this.EjecutarNoSQL(this.TEXT_CREATE);
  
    }

    add(config: InfoConfiguracion) {

        return this.EjecutarSQL(this.TEXT_INSERT, [config.Id, config.Opciones, config.IdUsuario]);
    }

    update(config: InfoConfiguracion) {
        return this.EjecutarSQL(this.TEXT_UPDATE, [config.Opciones, config.IdUsuario, config.Id]);
    }

    findById(id: number, callback: () => void) {

        this.EjecutarSQL(this.TEXT_TRAER_POR_ID, [])
            .then(response => {
                if (response.rows.length > 0)
                    return Promise.resolve(response.rows.item(0));
                return null;

            })
            .catch(error => Promise.reject(error));

    }

    getAll(idUsuario: string, callback: () => void) {
        
        let Configuraciones = [];

        this.EjecutarSQL(this.TEXT_TRAER_TODOS, [])
            .then(response => {
                
                for (let index = 0; index < response.rows.length; index++) {
                    var _configuracion = new InfoConfiguracion();
                    _configuracion.poblar(response.rows.item(index));
                    Configuraciones.push(_configuracion);
                }
                return Promise.resolve(Configuraciones);
            })
            .catch(error => Promise.reject(error));

            return Configuraciones;
    }

}