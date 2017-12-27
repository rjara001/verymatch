import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import emailMask from 'text-mask-addons/dist/emailMask';
import { PasswordValidator } from '../validations/PasswordValidator';
import { PageBase } from '../../modelo/InfoBase';
import { globalDataService } from '../../servicios/globalDataService';
import { OAuthService } from '../../servicios/oauth.service';


/**
 * Generated class for the RegistrarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registrar',
  templateUrl: 'registrar.html',
})
export class RegistrarPage extends PageBase {
  registerForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController
    , public loadingCtrl: LoadingController , public toastCtrl: ToastController
    , public globalData: globalDataService 
    , public oauthService: OAuthService) {
    super(alertCtrl, loadingCtrl,toastCtrl, globalData);
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required,Validators.email])
  });
  }

  registrar(){
    this.show();
    
      this.oauthService.Register(this.registerForm.get("email").value).then(_=>{
        if (_._body=='UsuarioCreado')
          this.alerta('Registrando usuario..', 'Tu registro se realizó correctamente, ahora debes revisar tu correo y seguir las instrucciones para terminar el proceso de registro.');
      else
          this.mensaje(_);

          this.hide();
      });
  }
  
ionViewDidLoad() {
    
  }
  
}
