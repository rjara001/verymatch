import { Injectable } from "@angular/core";
import { GrupoService } from "./GrupoService";
import { globalDataService } from "./globalDataService";
import { InfoGrupo } from "../modelo/InfoGrupo";
import { PalabraService } from "./PalabraService";

@Injectable()
export class PalabraAccionService{
    constructor(public servicioGrupo:GrupoService, public servicioPalabra:PalabraService, public globalData:globalDataService){

    }

    mover(origen:number, nombreGrupoDestino:string):Promise<void> {
        
        // Se supone que servicioGrupo tiene cargada la informacion en memoria, ya que singleton
        
        let el:InfoGrupo = this.servicioGrupo.getGrupoPorNombre(nombreGrupoDestino);

        return this._mover(origen, el.Id, this.globalData.getIdGrupo());

        //repeticiones (0:aprendidas
        //1:reconocidas
        //2:conocidas
        //3:descubiertas)
    }

    _mover(repeticion, idGrupoDestino, idGrupoActual):Promise<void> {
        //var _api = new APIservicio.api(Constantes.url, $rootScope.globals.currentUser.username);

        let _aryPromesas = [];

        for (var _indice = 0; _indice < this.servicioPalabra.Items.length; _indice++)
            if (this.servicioPalabra.Items[_indice].Repeticiones == repeticion
                && this.servicioPalabra.Items[_indice].EsConocido
                && this.servicioPalabra.Items[_indice].IdGrupo == idGrupoActual) {

                this.servicioPalabra.Items[_indice].IdGrupo = idGrupoDestino;

                this.servicioPalabra.Items[_indice].DebeActualizar = 1;
                // Guardar
                _aryPromesas.push(this.servicioPalabra.add(this.servicioPalabra.Items[_indice]));
            }

            return Promise.all(_aryPromesas).then(_=>{
                
                return Promise.resolve();
            });
    }

    reiniciar():Promise<void> {
        let _aryPromesas = [];

        for (var _indice = 0; _indice < this.servicioPalabra.Items.length; _indice++)
            if (this.servicioPalabra.Items[_indice].IdGrupo == this.servicioPalabra.getInfo().IdGrupo) {
                this.servicioPalabra.Items[_indice].EsConocido = false;
                this.servicioPalabra.Items[_indice].Repeticiones = 0;
                this.servicioPalabra.Items[_indice].DebeActualizar = 1;
                _aryPromesas.push(this.servicioPalabra.add(this.servicioPalabra.Items[_indice]));
            }

            return Promise.all(_aryPromesas).then(_=>{
                
                return Promise.resolve();
            });
    }

}