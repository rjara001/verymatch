import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
//import { Storage, SqlStorage } from 'ionic-angular';
//import { SQLite } from 'ionic-native';

const DB_NAME: string = 'verymatch';
const DB_LOCATION: string = 'default';
const win: any = window;

@Injectable()
export class BaseDataService {
  private _db: any;


  esWeb() {
    return !win.sqlitePlugin;
  }

  EjecutarNoSQL(sql: string) {

    if (!this.esWeb())
      return this.db().executeSql(sql);
    else
      this.db().transaction(tx => tx.executeSql(sql));
  }

  EjecutarSQL(sql: string, params: any): Promise<any> {

    if (!this.esWeb())
      return this.db().executeSql(sql, params);
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

    if (this._db == null) {
      if (!this.esWeb()) {
        this._db = new SQLite();

        this._db.openDatabase({
          name: DB_NAME,
          location: DB_LOCATION
        });
      } else {
        // webSQL wrapper
        this._db = win.openDatabase(DB_NAME, '1.0', 'database', 5 * 1024 * 1024);
      }
    }
    return this._db;
  }

  constructor() {

  }

}