export class globalDataService {
  private static _codigoUsuario:number = -1;
  private static _email:string;
  private static _idGrupo:number = -1;

  public static getCodigoUsuario():number{
    let _usuario = window.localStorage.getItem("usuario");
    this._codigoUsuario = Number(_usuario);

    return this._codigoUsuario;
  }

  public static setCodigoUsuario(codigoUsuario:number){
    this._codigoUsuario = codigoUsuario;
    window.localStorage.setItem("usuario",String(codigoUsuario));
  }

  public static setEmailUsuario(email:string){
    this._email = email;
    window.localStorage.setItem("email",String(email));
  }

  public static getEmailUsuario():string{
    return this._email;
  }

  public static getIdGrupo():number{
    let _grupo = Number(window.localStorage.getItem(this.getCodigoUsuario() + ":idGrupo"));
    this._idGrupo = _grupo;
    return this._idGrupo;
  }

  public static setIdGrupo(idGrupo:number){
    this._idGrupo = idGrupo;
    window.localStorage.setItem(this.getCodigoUsuario() + ":idGrupo",String(idGrupo));
  }
  // dataChangeObserver: any;
  // static dataPar: Array<Par> = new Array<Par>();
  // dataChange: Observable<any>;

  // constructor() {
  //   this.dataPar = new Array<Par>();
  //   // this.dataChange = new Observable((observer: Observer<any>) => {
  //   //   this.dataChangeObserver = observer;
  //   // });
  // }

  // public static setData(data: Par) {
  //   let _data = this.dataPar.find(_ => _.Key == data.Key);
  //   let index = this.dataPar.indexOf(_data);

  //   if (index >= 0)
  //     this.dataPar[index] = data;
  //   else
  //     this.dataPar.push(data);

  //   // this.dataChangeObserver.next(this.dataPar);
  // }

  // public static getData(key: string) {
  //   let _item = this.dataPar.find(_ => _.Key == key);
  //   if (_item)
  //     return _item.Valor;

  //   return new String();
  // }
}

export class Par {

  constructor(key: string, valor: any) {
    this.Key = key;
    this.Valor = valor;

  }
  Key: string
  Valor: any
}