import { InfoGrupo } from '../modelo/InfoGrupo';
import { InfoPalabra } from '../modelo/InfoPalabra';
import { LoadingController, Loading, AlertController } from 'ionic-angular';
import { globalDataService } from '../servicios/globalDataService';
import { ToastController } from 'ionic-angular';

export class InfoBase {
    Grupo: InfoGrupo;
    private _codigoUsuario:number;
  
    public getCodigoUsuario(): number {
        return this._codigoUsuario;
    }

    public setCodigoUsuario(codigo:number){
        this._codigoUsuario = codigo;
    }

}

export class PageBase {
    loading: Loading;

    constructor(public alertCtrl: AlertController
        , public loadingCtrl: LoadingController
        , public toastCtrl: ToastController
        , public globalData: globalDataService) {

    }
    hide() {
        this.loading.dismiss();
    }

    showAlert(titulo: string, mensaje: string) {

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

    public getCodigoUsuario(): number {

        return this.globalData.getCodigoUsuario();
    }

    public getEmailUsuario(): string {
        
                return this.globalData.getEmailUsuario();
            }
    public getIdGrupo(): number {
        return this.globalData.getIdGrupo();
    }

    public mensaje(texto) {
        let toast = this.toastCtrl.create({
            message: texto,
            duration: 3000,
            position:'bottom'
          });
          toast.present();

    }

    public alerta(titulo, mensaje) {
        let alert = this.alertCtrl.create({
            title: titulo,
            subTitle: mensaje
        });
        alert.present();
    }

    public confirmar(titulo, mensaje) {
        return new Promise<any>((resolve, reject) => {
            let confirm = this.alertCtrl.create({
                title: titulo,
                message: mensaje,
                buttons: [
                    {
                        text: 'Aceptar',
                        handler: resolve
                    },
                    {
                        text: 'Declinar',
                        handler: reject
                    }
                ]
            });
            confirm.present();
        });

    }
}