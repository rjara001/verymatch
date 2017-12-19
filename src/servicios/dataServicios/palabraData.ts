import { InfoPalabra } from "../../modelo/InfoPalabra";
import { BaseDataService } from "./BaseDataService";

export class palabraData extends BaseDataService {

    TEXT_CREATE: string = "create table if not exists Palabra (Id integer, Nombre text, Significado text, Indice integer, EsConocido integer, Repeticiones integer, IdUsuario integer, IdGrupo integer, DebeActualizar integer)";
    TEXT_INSERT: string = "insert into Palabra (Id, Nombre, Significado, Indice, EsConocido, Repeticiones, IdUsuario, IdGrupo, DebeActualizar) values (?,?,?,?,?,?,?,?,?)";
    TEXT_UPDATE: string = "update Palabra set Nombre=?, Significado=?, Indice=?, EsConocido=?, Repeticiones=?, IdUsuario=?, IdGrupo=?, DebeActualizar=? where Id=?";
    TEXT_TRAER_POR_ID: string = "select Id, Nombre, Significado, Indice, EsConocido, Repeticiones, IdUsuario, IdGrupo, DebeActualizar from Palabra where Id = ?";
    TEXT_TRAER_TODOS: string = "select Id, Nombre, Significado, Indice, EsConocido, Repeticiones, IdUsuario, IdGrupo, DebeActualizar from Palabra where idGrupo = ? and IdUsuario = ?";
    TEXT_ELIMINAR_TODO: string = "delete from Palabra where IdUsuario = ?";
    TEXT_ELIMINAR_TODO_ID: string = "delete from Palabra where IdUsuario = ? and IdGrupo = ?";
    TEXT_PENDIENTES: string = "select count(*) Cantidad from Palabra where IdUsuario = ? and DebeActualizar==1";
    TEXT_DEBE_ACTUALIZAR: string = "select Id, Nombre, Significado, Indice, EsConocido, Repeticiones, IdUsuario, IdGrupo, DebeActualizar from Palabra where IdUsuario = ? and DebeActualizar = 1";

    constructor() {
        super();
    }

    crearTabla() {
        this.EjecutarNoSQL(this.TEXT_CREATE);
    }

    add(palabra: InfoPalabra) {

        return this.EjecutarSQL(this.TEXT_INSERT, [palabra.Id, palabra.Nombre, palabra.Significado, palabra.Indice, palabra.EsConocido, palabra.Repeticiones, palabra.IdUsuario, palabra.IdGrupo, palabra.DebeActualizar]);
    }

    update(palabra: InfoPalabra) {
        return this.EjecutarSQL(this.TEXT_UPDATE, [palabra.Nombre, palabra.Significado, palabra.Indice, palabra.EsConocido, palabra.Repeticiones, palabra.IdUsuario, palabra.IdGrupo, palabra.DebeActualizar, palabra.Id]);
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

    getAll(idUsuario: string, idGrupo: number):Promise<InfoPalabra[]> {

        return this.EjecutarSQL(this.TEXT_TRAER_TODOS, [idGrupo, idUsuario])
            .then(response => {
                let Palabraes = new Array<InfoPalabra>();
                for (let index = 0; index < response.rows.length; index++) {
                    var _Palabra = new InfoPalabra(idUsuario, idGrupo);
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

    eliminarTodo(idUsuario: string, idGrupo: number) {
        this.EjecutarSQL(this.TEXT_ELIMINAR_TODO, [idUsuario, idGrupo]);
    }

    eliminarTodoPorGrupo(idUsuario: string, idGrupo: number) {
        this.EjecutarSQL(this.TEXT_ELIMINAR_TODO_ID, [idUsuario, idGrupo]);
    }

    getNumeroPendientes(idUsuario: string, callback: () => void) {
        return this.EjecutarSQL(this.TEXT_PENDIENTES, [idUsuario])
            .then(response => {
                if (response.rows.length > 0) {
                    return Number(response.rows.item(0).Cantidad);
                }
                return 0;
            })
            .catch(error => Promise.reject(error));

    }

    getDebeActualizar(idUsuario: string) {
        return this.EjecutarSQL(this.TEXT_DEBE_ACTUALIZAR, [])
            .then(response => {
                let Palabraes = [];
                for (let index = 0; index < response.rows.length; index++) {
                    var _Palabra = new InfoPalabra(idUsuario, -1);
                    _Palabra.poblar(response.rows.item(index));
                    Palabraes.push(_Palabra);
                }
                return Promise.resolve(Palabraes);
            })
            .catch(error => Promise.reject(error));


    }

}