import { globalDataService, Par } from "./globalDataService";

export class BaseService{

    public IdUsuario:string;

    constructor(idUsuario:string){
        this.IdUsuario = idUsuario;
    }
    // globalData:globalDataService;
    
    // getIdUsuario():string{
    //     this.globalData = new globalDataService();
    //     return this.globalData.getData("idusuario");
    // }

    // setIdUsuario(idusuario:string){
    //     return this.globalData.setData(new Par("idusuario", idusuario));
    // }
}