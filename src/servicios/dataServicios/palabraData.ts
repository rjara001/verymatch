import { InfoPalabra } from "../../modelo/InfoPalabra";
import { BaseDataService } from "./BaseDataService";
import {InfoBase} from '../../modelo/InfoBase';
import { SQLite } from "@ionic-native/sqlite";
import { Injectable } from "@angular/core";

@Injectable()
export class palabraData extends BaseDataService {

    TEXT_CREATE: string = "create table if not exists Palabra (Id integer, Nombre text, Significado text, Indice integer, EsConocido integer, Repeticiones integer, CodigoUsuario integer, IdGrupo integer, DebeActualizar integer)";
    TEXT_INSERT: string = "insert into Palabra (Id, Nombre, Significado, Indice, EsConocido, Repeticiones, CodigoUsuario, IdGrupo, DebeActualizar) values (?,?,?,?,?,?,?,?,?)";
    TEXT_UPDATE: string = "update Palabra set Nombre=?, Significado=?, Indice=?, EsConocido=?, Repeticiones=?, CodigoUsuario=?, IdGrupo=?, DebeActualizar=? where Id=?";
    TEXT_TRAER_POR_ID: string = "select Id, Nombre, Significado, Indice, EsConocido, Repeticiones, CodigoUsuario, IdGrupo, DebeActualizar from Palabra where Id = ?";
    TEXT_TRAER_TODOS: string = "select Id, Nombre, Significado, Indice, EsConocido, Repeticiones, CodigoUsuario, IdGrupo, DebeActualizar from Palabra where idGrupo = ? and CodigoUsuario = ?";
    TEXT_ELIMINAR_TODO: string = "delete from Palabra where CodigoUsuario = ?";
    TEXT_ELIMINAR_TODO_ID: string = "delete from Palabra where CodigoUsuario = ? and IdGrupo = ?";
    TEXT_PENDIENTES: string = "select count(*) Cantidad from Palabra where CodigoUsuario = ? and DebeActualizar==1";
    TEXT_DEBE_ACTUALIZAR: string = "select Id, Nombre, Significado, Indice, EsConocido, Repeticiones, CodigoUsuario, IdGrupo, DebeActualizar from Palabra where CodigoUsuario = ? and DebeActualizar = 1";

    constructor(public sqlite:SQLite) {
        super(sqlite);
    }

    crearTabla() {
        this.EjecutarNoSQL(this.TEXT_CREATE);
    }

    add(palabra: InfoPalabra):Promise<void> {

        return this.EjecutarSQL(this.TEXT_INSERT, [palabra.Id, palabra.Nombre, palabra.Significado, palabra.Indice, Number(palabra.EsConocido), palabra.Repeticiones, palabra.getCodigoUsuario(), palabra.IdGrupo, palabra.DebeActualizar]);
    }

    update(palabra: InfoPalabra):Promise<void> {
        return this.EjecutarSQL(this.TEXT_UPDATE, [palabra.Nombre, palabra.Significado, palabra.Indice, Number(palabra.EsConocido), palabra.Repeticiones, palabra.getCodigoUsuario(), palabra.IdGrupo, palabra.DebeActualizar, palabra.Id]);
    }

    findById(id: number):Promise<any> {

        return this.EjecutarSQL(this.TEXT_TRAER_POR_ID, [id])
            .then(response => {
                if (response.rows.length > 0)
                    return Promise.resolve(response.rows.item(0));
                return null;

            })
            .catch(error => Promise.reject(error));

    }

    getAll(codigoUsuario: number, idGrupo: number):Promise<InfoPalabra[]> {

        return this.EjecutarSQL(this.TEXT_TRAER_TODOS, [idGrupo, codigoUsuario])
            .then(response => {
                let Palabraes = new Array<InfoPalabra>();
                for (let index = 0; index < response.rows.length; index++) {
                    var _Palabra = new InfoPalabra(codigoUsuario, idGrupo);
                    _Palabra.poblar(response.rows.item(index));
                    Palabraes.push(_Palabra);
                }
                return Palabraes;
            })
            .catch(

            error => {
                Promise.reject(error);
                console.log(error);
                return new Array<InfoPalabra>();
            }
            );
    }

    eliminarTodo(codigoUsuario: number, idGrupo: number) {
        this.EjecutarSQL(this.TEXT_ELIMINAR_TODO, [codigoUsuario, idGrupo]);
    }

    eliminarTodoPorGrupo(codigoUsuario: number, idGrupo: number) {
        this.EjecutarSQL(this.TEXT_ELIMINAR_TODO_ID, [codigoUsuario, idGrupo]);
    }

    getNumeroPendientes(codigoUsuario: number):Promise<number> {
       return this.EjecutarSQL(this.TEXT_PENDIENTES, [codigoUsuario])
            .then(response => {
                if (response.rows.length > 0) {
                    return Number(response.rows.item(0).Cantidad);
                }
                return 0;
            })
            .catch(error =>{

                 return Promise.reject(error);
                });

    }

    getDebeActualizar(codigoUsuario: number)     {
        return this.EjecutarSQL(this.TEXT_DEBE_ACTUALIZAR, [codigoUsuario])
            .then(response => {
                let Palabraes = [];
                for (let index = 0; index < response.rows.length; index++) {
                    var _palabra = new InfoPalabra(codigoUsuario, -1);
                    _palabra.poblar(response.rows.item(index));
                    _palabra.IdUsuario = codigoUsuario;
                    Palabraes.push(_palabra);
                }
                return Promise.resolve(Palabraes);
            })
            .catch(error => Promise.reject(error));


    }

}