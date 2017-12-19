import { Injectable, Injector } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { IOathProvider } from '../oauth.provider.interface';
import { Oauth } from 'ng2-cordova-oauth/oauth';
import { Facebook } from 'ng2-cordova-oauth/provider/facebook';
import { Config } from '../../config';
//import { loginAuthPropioService, authUsuario } from './login-auth.propio.service';
import { Constantes } from '../../modelo/enums';
import { globalDataService } from '../globalDataService';
import { Red } from '../util/red';
import { Headers } from '@angular/http';
import { Header } from 'ionic-angular/components/toolbar/toolbar-header';

interface ILoginResponse {
    access_token: string;
}
export class authUsuario {
    tokenNotificacion: any;
    Olvido: boolean;
    idapporigen: any;
    Contrasenia: any;
    idUsuario: any;
}

@Injectable()
export class PropioOauthProvider implements IOathProvider {
    usuario: authUsuario;
    globalData: globalDataService;

    constructor(public http: Http) { }

    /*  
      this.Login = Login;
      this.SetCredentials = SetCredentials;
      this.ClearCredentials = ClearCredentials;
      this.Register = Register;*/

    getProfile(accessToken: string): Promise<any> {
        return Promise.resolve();
    }
    
    login(config: Config): Promise<any> {
        this.usuario = new authUsuario();
        this.usuario.idUsuario = config.propio.usuario;
        this.usuario.Contrasenia = config.propio.contraseña;
        this.usuario.idapporigen = Constantes.idapporigen; // Identificador de multitenant de tipo verymatch
        this.usuario.Olvido = false;
        this.usuario.tokenNotificacion = Constantes.tokenNotificacion;

        return this.validar().then(_ => {
            if (_._body == "Success")
                return Promise.resolve({ success: true });
            else
                return Promise.resolve({ success: false, message: 'Usuario o contraseña incorrecta' });
        });


    }

    validar(): Promise<any> {

        if (!Red.revisarConexionInternet())
            return;

        var _url = "[HOST]/api/usuariowrapper/validar";

        _url = _url.replace("[HOST]", Constantes.url);

        var _postData = JSON.stringify(this.usuario);

        return this.http.post(_url
            , _postData
            , new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) }))
            .toPromise();

        // var _url = "[HOST]/api/usuariowrapper/validar";

        // _url = _url.replace("[HOST]", Constantes.url);

        // var xmlhttp = new XMLHttpRequest();

        // var _parametro = this.toParametro();

        // xmlhttp.onreadystatechange = function () {
        //     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        //         Promise.resolve(xmlhttp.responseText);
        //     }
        // }.bind(this);

        // xmlhttp.open("POST", _url, true);
        // xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");

        // xmlhttp.send(_parametro);
    }

    toParametro(): string {

        return "idusuario=" + this.usuario.idUsuario
            + "&contrasenia=" + this.usuario.Contrasenia
            + "&idapporigen=" + this.usuario.idapporigen
            + "&tokenNotificacion=" + this.usuario.tokenNotificacion
            + "&olvido=" + this.usuario.Olvido;

    }
    Register(usuario, callback) {

        //var response;
        //userService.Register(username)
        //    .then(function (responseObject) {
        //        if (responseObject.data == 'UsuarioCreado') {
        //            response = { success: true };
        //        } else {
        //            response = { success: false, message: responseObject.data };
        //        }
        //        callback(response);
        //    });
        usuario.idapporigen = Constantes.idapporigen;
        usuario.tokenNotificacion = Constantes.tokenNotificacion;

        this.registrar(callback);

    }

    registrar(callback) {

        if (!Red.revisarConexionInternet())
            return;

        var _url = "[HOST]api/usuariowrapper/registrar";

        _url = _url.replace("[HOST]", Constantes.url);

        var xmlhttp = new XMLHttpRequest();

        var _parametro = this.toParametro();

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                callback(xmlhttp.responseText);
            }
        }.bind(this);

        xmlhttp.open("POST", _url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");

        xmlhttp.send(_parametro);
    }

    SetCredentials(username: string, password: string, callback) {
        var authdata = Base64.encode(username + ':' + password);


        this.usuario.idUsuario = username;

        //  Register(usuario, callback);//  No recuerdo cual era la necesidad de esta linea (Register).

        globalDataService.setIdUsuario(username);
        // this.globalData.setData(new Par("idUsuario", username));
        // this.globalData.setData(new Par("authdata", authdata));

        //No se si se debe habilitar
        //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        // window.localStorage.setItem("usuario", username);

        callback();
    }

    ClearCredentials() {
        globalDataService.setIdUsuario("");
        //$http.defaults.headers.common.Authorization = 'Basic ';
    }
}

// Base64 encoding service used by AuthenticationService
class Base64 {

    static keyStr: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    static encode(input) {
        let output = "";
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this.keyStr.charAt(enc1) +
                this.keyStr.charAt(enc2) +
                this.keyStr.charAt(enc3) +
                this.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    }

    static decode(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            window.alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
    }
}