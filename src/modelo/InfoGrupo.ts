import { InfoPalabra } from "./InfoPalabra";
    

export class InfoGrupo {
    Id: any;
    Nombre: string;
    EstadoGrupo: any;
    NumeroMatch: any;
    CantidadMatch: any;
    IdUsuario: any;
    Palabras: InfoPalabra[];

    poblar(info: InfoGrupo): void {
        
            this.Id = info.Id;
            this.Nombre = info.Nombre;
            this.EstadoGrupo = info.EstadoGrupo;
            this.NumeroMatch = info.NumeroMatch;
            this.CantidadMatch = info.CantidadMatch;
            this.IdUsuario = info.IdUsuario;
        
    }
}