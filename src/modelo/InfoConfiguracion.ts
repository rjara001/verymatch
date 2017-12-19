export class InfoConfiguracion{[x: string]: any;
IdUsuario: any;
    Opciones: any;

    constructor(idusuario?:string){
        if (idusuario)
            this.IdUsuario = idusuario;
    }


}