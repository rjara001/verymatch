import {InfoBase} from '../modelo/InfoBase';
import { InfoGrupo } from './InfoGrupo';
import { InfoResumen } from './InfoResumen';

export class InfoJugar extends InfoBase {
    puedeEditar:boolean = false;
    finalizado:boolean = false;
    grupo:string;
    ValidarSiempreActivo: boolean;
    imgPalabra: string;
    imgSignificado:string;
    resumen:InfoResumen;
    NivelRepeticiones: any;
    RepetidasConocidas:number;
    RepetidasNoConocidas:number;
    RepetidasColaConocidas:number;
    RepetidasColaNoConocidas:number;
    NombrePalabra:string;
    SignificadoPalabra:string;
    mostrarValido:boolean;
    mostrarNoValido:boolean;

}

export class InfoEstadoPage{
    grupoInicial:InfoGrupo;
    grupos:Array<InfoGrupo>;
    resumen:InfoResumen;
    seleccion:number;
    
    aprendidas:boolean;
    reconocidas:boolean;
    conocidas:boolean;
    descubiertas:boolean;
    todos:boolean;
}

