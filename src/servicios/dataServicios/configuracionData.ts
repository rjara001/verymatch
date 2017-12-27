import { InfoConfiguracion } from "../../modelo/InfoConfiguracion";
import { BaseDataService } from "./BaseDataService";
import { SQLite } from "@ionic-native/sqlite";
import { Injectable } from "@angular/core";

@Injectable()
export class configuracionData extends BaseDataService {


    TEXT_CREATE: string = "create table if not exists Configuracion (Id text, Opciones text, CodigoUsuario integer)";
    TEXT_INSERT: string = "insert into Configuracion (Id, Opciones, CodigoUsuario) values (?,?,?)";
    TEXT_UPDATE: string = "update Configuracion set Opciones=?, CodigoUsuario=? where Id=?";
    TEXT_TRAER_POR_ID: string = "select Id, Opciones, CodigoUsuario from Configuracion where Id = ?";
    TEXT_TRAER_TODOS: string = "select Id, Opciones, CodigoUsuario from Configuracion where CodigoUsuario = ?";

    constructor(public sqlite:SQLite) {
        super(sqlite);
    }

    crearTabla():Promise<any> {
        return this.EjecutarNoSQL(this.TEXT_CREATE);
  
    }

    add(config: InfoConfiguracion):Promise<void> {

        return this.EjecutarSQL(this.TEXT_INSERT, [config.Id, config.Opciones, config.CodigoUsuario]);
    }

    update(config: InfoConfiguracion):Promise<void> {
        return this.EjecutarSQL(this.TEXT_UPDATE, [config.Opciones, config.CodigoUsuario, config.Id]);
    }

    findById(id: number):Promise<InfoConfiguracion> {

        return this.EjecutarSQL(this.TEXT_TRAER_POR_ID, [id])
            .then(response => {
                if (response.rows.length > 0)
                    return Promise.resolve(response.rows.item(0));
                return null;

            })
            .catch(error => Promise.reject(error));

    }

    getAll(CodigoUsuario: string):Promise<InfoConfiguracion[]> {
        
        let Configuraciones = [];

        return this.EjecutarSQL(this.TEXT_TRAER_TODOS, [CodigoUsuario])
            .then(response => {
                
                for (let index = 0; index < response.rows.length; index++) {
                    var _configuracion = new InfoConfiguracion();
                    _configuracion.poblar(response.rows.item(index));
                    Configuraciones.push(_configuracion);
                }
                return Promise.resolve(Configuraciones);
            })
            .catch(error => Promise.reject(error));

    }

}