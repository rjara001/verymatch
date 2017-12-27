import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
//import { Storage, SqlStorage } from 'ionic-angular';
//import { SQLite } from 'ionic-native';

const DB_NAME: string = 'verymatch';
const DB_LOCATION: string = 'default';
const win: any = window;

@Injectable()
export class BaseDataService {
  // private _db: any;

  constructor(public sqlite:SQLite) {

  }

  esWeb() {
    return !win.sqlitePlugin;
  }

  EjecutarNoSQL(sql: string): Promise<any> {

    if (!this.esWeb())
      return this.db().then(_ => {
        return _.executeSql(sql, {});
      });
    else
      return new Promise<any>((resolve, reject) => {
        this.db().transaction(
          tx => tx.executeSql(sql, null,
            (t, results) => {
              resolve(results);
            },
            (t, message) => {
              reject(message.message.toString());
            }))
      });
  }

  EjecutarSQL(sql: string, params: any): Promise<any> {

    if (!this.esWeb())
      return this.db().then(_ => {
        return _.executeSql(sql, params);
      });
    else {
      return new Promise<any>((resolve, reject) => {
        this.db().transaction(
          (tx) => tx.executeSql(sql, params,
            (t, results) => {
              resolve(results);
            },
            (t, message) => {
              reject(message.message.toString());
            }))
      });
    }

  }


  db(): any {
    //if (_db == null) {
    if (!this.esWeb()) {
     // let sqlite: SQLite = new SQLite();

      return this.sqlite.create({
        name: DB_NAME,
        location: DB_LOCATION
      });
    } else {
      // webSQL wrapper
      return win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
    }
    //}
  }


}