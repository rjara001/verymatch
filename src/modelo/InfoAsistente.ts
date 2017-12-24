import { InfoBase } from "./InfoBase";
import { InfoJugar } from "./infoJugar"; 


export class InfoAsistente extends InfoJugar {
  botones: { nombreRepasar: string; nombreJugar: string; };
  deseeSeguirJugando:boolean;
  imgHablado: string;
}