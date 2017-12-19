import {InfoBase} from '../modelo/InfoBase';
import { InfoGrupo } from './InfoGrupo';

export class InfoJugar extends InfoBase {
    puedeEditar:boolean = false;
    finalizado:boolean = false;
    grupo:string;
    ValidarSiempreActivo: boolean;
    imgPalabra: string;
    imgSignificado:string;
    resumen:Resumen;
    NivelRepeticiones: any;
    RepetidasConocidas:number;
    RepetidasNoConocidas:number;
    RepetidasColaConocidas:number;
    RepetidasColaNoConocidas:number;
    NombrePalabra:string;
    SignificadoPalabra:string;
}

export class InfoEstadoPage{
    grupoInicial:InfoGrupo;
    grupos:Array<InfoGrupo>;
    resumen:any;
    seleccion:number;
}

export class Resumen{
    Total:number = 0;
    NumeroRepeticionesActual:number = 0;
    TotalAprendidas:number = 0;
    RepetidasConocidas = [0, 0, 0, 0, 0];
    RepetidasNoConocidas = [0, 0, 0, 0, 0];
    IdUsuario:string;// = $rootScope.globals.currentUser.username
}