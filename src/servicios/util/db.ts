import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

export class db{

    constructor(private sqlite: SQLite){

    }
 /*   instanciaDB () {
        this.database = new SQLite();
        
        if (this.database == null) {
            this.database.openDatabase('veryMatch', verydb.version.versionActual, 'veryMatch DB', 100 * 1024);

        }
        return this._db;
    }*/

    public createDatabase(){
        this.sqlite.create({
          name: 'veryMatch.db',
          location: 'default' // the location field is required
        })
        .then((db) => {
          console.log(db);
        })
        .catch(error =>{
          console.error(error);
        });
      }
}