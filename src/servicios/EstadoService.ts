import { GrupoService } from "./GrupoService";
import { PalabraService } from "./PalabraService";
import { BaseService } from "./BaseService";
import { InfoGrupo } from "../modelo/InfoGrupo";
import { InfoPalabra } from "../modelo/InfoPalabra";

export class EstadoService extends BaseService {
    IdGrupo: number;
    
    servicioGrupo: GrupoService;
    servicioPalabra: PalabraService;

    constructor(idUsuario:string, idGrupo:number){
        super(idUsuario)
        this.IdGrupo = idGrupo;
        this.servicioGrupo = new GrupoService(idUsuario)
        this.servicioPalabra = new PalabraService(idUsuario, idGrupo);
    }

    cargar(): Promise<InfoPalabra[]> {
        
        if (this.servicioGrupo.Items.length > 0)
            return this.servicioPalabra.cargar();
        else {
            return this.servicioGrupo.cargar().then(_ => {
                if (this.IdGrupo<0)
                    return this.cargarGrupoPorDefecto();
                else
                   return this.servicioPalabra.cargar();
            });
        }
    }

    cargarGrupoPorDefecto():Promise<InfoPalabra[]> {
        

            this.servicioPalabra.getInfo().IdGrupo = this.servicioGrupo.getIdGrupoPorDefecto().Id;

            return this.servicioPalabra.cargar();

    }


    buscarGrupoPorId(id): InfoGrupo {
        let _grupos: Array<InfoGrupo> = this.servicioGrupo.Items;

        for (var _cont = 0; _cont < _grupos.length; _cont++)
        if (_grupos[_cont].Id == id)
            return _grupos[_cont];
        return _grupos[0];

    }

}