import {Component} from '@angular/core';
declare var navigator: any; 
declare var Connection: any;

export class Red {
    static JsonToURLEncoded(element:any, key?:string, list?:Array<any>){
        var list = list || [];
        if (typeof (element) == 'object') {
          for (var idx in element)
            this.JsonToURLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
        } else {
          list.push(key + '=' + encodeURIComponent(element));
        }
        return list.join('&');
    }

    static revisarConexionInternet(): boolean {
        if (navigator && navigator.connection && navigator.connection.type === 'none') {
            alert('Para continuar la aplicación requiere conexion a Internet. Favor establezca conexion a Internet');

            return false;
        }

        return true;

    }
/*
    checkNetwork() {
            var networkState = navigator.connection.type;
            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';
            let alert = Alert.create({
                title: "Connection Status",
                subTitle: states[networkState],
                buttons: ["OK"]
            });
            this.navCtrl.present(alert);

    }*/
}