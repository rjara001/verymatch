export class globalDataService {
  //private _codigoUsuario:number = -1;
  //private static _email:string;
  private static _idGrupo:number = -1;

  public getProvider(){
    let _oauthstore = window.localStorage.getItem("oauthToken");
    if (_oauthstore)
    {
      let _oauth = JSON.parse(window.localStorage.getItem("oauthToken"));
      return _oauth.provider;
    }
    return "";
  }

  public getCodigoUsuario():number{
    return Number(window.localStorage.getItem("usuario"));
    // this._codigoUsuario = Number(_usuario);

    // return this._codigoUsuario;
  }

  public setCodigoUsuario(codigoUsuario:number){
 //   this._codigoUsuario = codigoUsuario;
    window.localStorage.setItem("usuario",String(codigoUsuario));
  }

  public setEmailUsuario(email:string){
  //  this._email = email;
    window.localStorage.setItem("email",String(email));
  }

  public getEmailUsuario():string{
    return window.localStorage.getItem("email");
  }

  public getIdGrupo():number{
    return Number(window.localStorage.getItem(this.getCodigoUsuario() + ":idGrupo"));
    // this._idGrupo = _grupo;
    // return this._idGrupo;
  }

  public setIdGrupo(idGrupo:number){
 //   this._idGrupo = idGrupo;
    window.localStorage.setItem(this.getCodigoUsuario() + ":idGrupo",String(idGrupo));
  }
  public clear(){
    this.setEmailUsuario("");
    this.setCodigoUsuario(-1);
  }
}

export class Par {

  constructor(key: string, valor: any) {
    this.Key = key;
    this.Valor = valor;

  }
  Key: string
  Valor: any
}