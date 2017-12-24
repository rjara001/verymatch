import {InfoBase} from '../modelo/InfoBase';
import { InfoResumen } from './InfoResumen';

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
    IdGrupo : number;
    DebeActualizar:number;
    Resumen: InfoResumen;
    IdUsuario:number;
    
    constructor(codigoUsuario:number, idGrupo:number){
        super();
        this.IdGrupo = idGrupo;
        this.setCodigoUsuario(codigoUsuario);
        this.Repeticiones = 0;
    }

    poblar(item: InfoPalabra) {
        this.Id = item.Id;
        this.Nombre = item.Nombre;
        this.EstadoGrupo = item.EstadoGrupo;
        this.NumeroMatch = item.NumeroMatch;
        this.CantidadMatch = item.CantidadMatch;
        this.Significado = item.Significado;
        this.DebeActualizar = item.DebeActualizar;
        this.EsConocido = Boolean(item.EsConocido);
        this.IdGrupo = item.IdGrupo;
        this.Indice = item.Indice;
        this.Repeticiones = item.Repeticiones;

    }

}