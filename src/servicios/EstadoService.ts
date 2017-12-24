import { GrupoService } from "./GrupoService";
import { PalabraService } from "./PalabraService";
import { BaseService } from "./BaseService";
import { InfoGrupo } from "../modelo/InfoGrupo";
import { InfoPalabra } from "../modelo/InfoPalabra";
import { Inject, Injectable, NgModule } from "@angular/core";
import { PalabraAccionService } from "./PalabraAccionService";

@Injectable()
export class EstadoService extends BaseService {

    constructor(public servicioGrupo:GrupoService, public servicioPalabra:PalabraService, public accionPalabra:PalabraAccionService){
        super()
             
    }

    iniciar(codigoUsuario:number){
        this.servicioGrupo.CodigoUsuario = codigoUsuario;
        this.servicioPalabra.iniciar(codigoUsuario, this.servicioGrupo.Info.Id);
    }

    cargar(): Promise<boolean> {
        
        if (this.servicioGrupo.Items.length > 0)
            return this.servicioPalabra.cargar(this.servicioGrupo.Info.Id);
        else {
            return this.servicioGrupo.cargar().then(() => {
                if (this.servicioGrupo.Info.Id<=0)
                {
                    this.servicioPalabra.getInfo().IdGrupo = this.servicioGrupo.getIdGrupoPorDefecto().Id;
                    return this.servicioPalabra.cargar(this.servicioGrupo.Info.Id);
                }
                else
                   return this.servicioPalabra.cargar(this.servicioGrupo.Info.Id);
            });
        }
    }

    buscarGrupoPorId(id): InfoGrupo {
        let _grupos: Array<InfoGrupo> = this.servicioGrupo.Items;

        for (var _cont = 0; _cont < _grupos.length; _cont++)
        if (_grupos[_cont].Id == id)
            return _grupos[_cont];
        return _grupos[0];

    }

}