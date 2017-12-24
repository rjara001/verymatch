import { InfoPalabra } from "./InfoPalabra";
    

export class InfoGrupo {
    Id: number;
    Nombre: string;
    EstadoGrupo: any;
    NumeroMatch: any;
    CantidadMatch: any;
    CodigoUsuario: number;
    Palabras: InfoPalabra[];


    public constructor(item?: InfoGrupo){
        this.Id = -1;
        this.Nombre = "";
        
        if (item)
            this.poblar(item);
        
    }

    poblar(info: InfoGrupo): void {
        
            this.Id = info.Id;
            this.Nombre = info.Nombre;
            this.EstadoGrupo = info.EstadoGrupo;
            this.NumeroMatch = info.NumeroMatch;
            this.CantidadMatch = info.CantidadMatch;
            //this.CodigoUsuario = info.CodigoUsuario;
        
    }
}