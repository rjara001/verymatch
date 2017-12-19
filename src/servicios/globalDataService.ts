export class globalDataService {
  private static _idUsuario:string;
  private static _idGrupo:number = -1;

  public static getIdUsuario():string{
    let _usuario = window.localStorage.getItem("usuario");
    this._idUsuario = _usuario;

    return this._idUsuario;
  }

  public static setIdUsuario(idUsuario:string){
    this._idUsuario = idUsuario;
    window.localStorage.setItem("usuario",idUsuario);
  }

  public static getIdGrupo():number{
    let _grupo = Number(window.localStorage.getItem(this.getIdUsuario() + ":idGrupo"));
    this._idGrupo = _grupo;
    return this._idGrupo;
  }

  public static setIdGrupo(idGrupo:number){
    this._idGrupo = idGrupo;
    window.localStorage.setItem(this.getIdUsuario() + ":idGrupo",String(idGrupo));
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