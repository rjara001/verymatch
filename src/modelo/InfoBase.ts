import { InfoGrupo } from '../modelo/InfoGrupo';
import { InfoPalabra } from '../modelo/InfoPalabra';
import { LoadingController, Loading, AlertController } from 'ionic-angular';
import { globalDataService } from '../servicios/globalDataService';

export class InfoBase{
    Grupo: InfoGrupo;
    globalData:globalDataService;

    getIdUsuario():string{
        return globalDataService.getIdUsuario();
    }

}

export class PageBase {
    loading: Loading;
   
    constructor(public alertCtrl: AlertController
        , public loadingCtrl:LoadingController) {

    }
    hide() {
        this.loading.dismiss();
    }

    showAlert(titulo:string, mensaje:string){

            let alert = this.alertCtrl.create({
              title: titulo,
              subTitle: mensaje,
              buttons: ['OK']
            });
            alert.present();
          
    }
    show() {

        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `
          <div class="custom-spinner-container">
            <div class="custom-spinner-box">Cargando...</div>
          </div>`
        });

        this.loading.present();
    }

    public getIdUsuario():string{

            return globalDataService.getIdUsuario();
    }

    public getIdGrupo():number{
            return globalDataService.getIdGrupo();
    }

    // setIdGrupo(idgrupo:number){
    //         window.localStorage.setItem(window.localStorage.getItem(globalDataService.getData("idUsuario") + ":idGrupo")
    //                             , String(this.getIdGrupo()));

    //         globalDataService.setData(new Par("idgrupo", idgrupo));
    // }

    // setIdUsuario(idusuario:string){

    //         globalDataService.setData(new Par("idusuario", idusuario));
    // }

}