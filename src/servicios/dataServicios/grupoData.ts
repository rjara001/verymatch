import { InfoGrupo } from "../../modelo/InfoGrupo";
import { BaseDataService } from "./BaseDataService";
import { Console } from "@angular/core/src/console";
import { SQLite } from "@ionic-native/sqlite";
import { Injectable } from "@angular/core";

@Injectable()
export class grupoData extends BaseDataService{
    
    TEXT_CREATE:string = "create table if not exists Grupo (Id integer, Nombre text, EstadoGrupo integer, NumeroMatch integer, CantidadMatch integer, CodigoUsuario integer)";
    TEXT_INSERT:string = "insert into Grupo (Id, Nombre, EstadoGrupo, NumeroMatch, CantidadMatch, CodigoUsuario) values (?,?,?,?,?,?)";
    //TEXT_UPDATE:string = "update Configuracion set Opciones=?, IdUsuario=? where Id=?";
    TEXT_TRAER_POR_ID:string = "select Id, Nombre, EstadoGrupo, NumeroMatch, CantidadMatch, CodigoUsuario from Grupo where Id = ?";
    TEXT_TRAER_TODOS:string = "select Id, Nombre, EstadoGrupo, NumeroMatch, CantidadMatch, CodigoUsuario from Grupo where CodigoUsuario = ?";

    constructor(public sqlite:SQLite) {
        super(sqlite);
    }
  
    crearTabla() {
         this.EjecutarNoSQL(this.TEXT_CREATE);
    }

    add(grupo:InfoGrupo) {

        return this.EjecutarSQL(this.TEXT_INSERT, [grupo.Id, grupo.Nombre, grupo.EstadoGrupo, grupo.NumeroMatch, grupo.CantidadMatch, grupo.CodigoUsuario]);
      }
/*
    update (config:InfoGrupo) {
        return this.db.executeSql(this.TEXT_UPDATE, [config.Opciones, config.IdUsuario, config.Id]);
    }*/
    
    findById (id:number):Promise<any> {

        return this.EjecutarSQL(this.TEXT_TRAER_POR_ID, [id])
            .then(response => {
                if (response.rows.length > 0)
                    return Promise.resolve(response.rows.item(0) );
                return null;
                
            })
            .catch(error => Promise.reject(error));

    }

    getAll (codigoUsuario:number):Promise<Array<InfoGrupo>> {

        return this.EjecutarSQL(this.TEXT_TRAER_TODOS, [codigoUsuario])
            .then(response => {
            let Grupoes = new Array<InfoGrupo>();
            for (let index = 0; index < response.rows.length; index++) {
                var _Grupo = new InfoGrupo();
                _Grupo.poblar(response.rows.item(index));
                
                Grupoes.push( _Grupo );

            }
            return Promise.resolve( Grupoes );
            })
        .catch(error =>
            {
                Promise.reject(error)
                console.error(error);
                return Promise.resolve( new Array<InfoGrupo>() );
            }
            );
    }

}