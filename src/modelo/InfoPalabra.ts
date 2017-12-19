import {InfoBase} from '../modelo/InfoBase';

export class InfoPalabra extends InfoBase{
    CantidadMatch: any;
    NumeroMatch: any;
    EstadoGrupo: any;
    Nombre:string;
    Id:number;
    Significado:string;
    Indice:number;
    EsConocido:boolean;
    Repeticiones :number;
    IdUsuario:string;
    IdGrupo : number;
    DebeActualizar:boolean;
    
    constructor(idUsuario:string, idGrupo:number){
        super();
        this.IdGrupo = idGrupo;
        this.IdUsuario = idUsuario;
    }

    poblar(item: InfoPalabra) {
        this.Id = item.Id;
        this.Nombre = item.Nombre;
        this.EstadoGrupo = item.EstadoGrupo;
        this.NumeroMatch = item.NumeroMatch;
        this.CantidadMatch = item.CantidadMatch;
        this.IdUsuario = item.IdUsuario;
    }

}