import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import '@capacitor-community/sqlite';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const { CapacitorSQLite, Device, Storage } = Plugins;

const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME_KEY = 'battery-db';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  dbReady = new BehaviorSubject(false);
  dbName = DB_NAME_KEY;

  constructor(private http: HttpClient, private alertCtrl: AlertController) { }

  async init(): Promise<void> {
    const info = await Device.getInfo();

    if (info.platform === 'android') {
      try {
        const sqlite = CapacitorSQLite as any;
        await sqlite.requestPermissions();
        this.setupDatabase();
      } catch (e) {
        const alert = await this.alertCtrl.create({
          header: 'No DB access',
          message: "This app can't work without Database access.",
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      this.setupDatabase();
    }
  }

  private async setupDatabase() {
    const dbSetupDone = await Storage.get({ key: DB_SETUP_KEY });

    if (!dbSetupDone.value) {
      this.downloadDatabase();
    } else {
      this.dbName = (await Storage.get({ key: DB_NAME_KEY })).value;
      await CapacitorSQLite['open']({ database: this.dbName });
      this.dbReady.next(true);
    }
  }

  // Potentially build this out to an update logic:
  // Sync your data on every app start and update the device DB
  private async downloadDatabase(update = false) {
    const jsonExport = this.readJsonData("db.json")

      const jsonstring = JSON.stringify(jsonExport);
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

      if (isValid.result) {
        await Storage['set']({ key: DB_NAME_KEY, value: this.dbName });
        await CapacitorSQLite.imimportFromJson({ jsonstring });
        await Storage['set']({ key: DB_SETUP_KEY, value: '1' });

        // Your potential logic to detect offline changes later
        if (!update) {
          await CapacitorSQLite.createSyncTable();
        } else {
          await CapacitorSQLite.setSyncDate({ syncdate: '' + new Date().getTime() })
        }
        this.dbReady.next(true);
      }

  }

  private readJsonData(_file : string){
    fetch(_file).then(res=>res.json()).then(json=>{
        console.log("OUTPUT: ", json);
        return json;
    });
  }

  ngetProductList() {
    return this.dbReady.pipe(
      switchMap(isReady => {
        if (!isReady) {
          return of({ values: [] });
        } else {
          const statement = 'SELECT * FROM products;';
          return from(CapacitorSQLite.query({ statement, values: [] }));
        }
      })
    )
  }

  async getProductById(id : number) {
    const statement = `SELECT * FROM products LEFT JOIN vendors ON vendors.id=products.vendorid WHERE products.id=${id} ;`;
    return (await CapacitorSQLite.query({ statement, values: [] })).values[0];
  }

  getDatabaseExport(mode : string) {
    return CapacitorSQLite.exportToJson({ jsonexportmode: mode });
  }

  addDummyProduct(name : string) {
    const randomValue = Math.floor(Math.random() * 100) + 1;
    const randomDate = new Date().getTime() - Math.floor(Math.random() * 10000000000);
    const randomDate2 = new Date().getTime() - Math.floor(Math.random() * 10000000000);
    const statement = `INSERT INTO batteries (name, device_id, date_of_purchase, number_of_cycles,last_cycle_date,) VALUES ('${name}',7, ${randomDate}, ${randomValue}, ${randomDate2});`;
    return CapacitorSQLite.execute({ statements: statement });
  }

  deleteProduct(productId : number) {
    const statement = `DELETE FROM products WHERE id = ${productId};`;
    return CapacitorSQLite.execute({ statements: statement });
  }

  // For testing only..
  async deleteDatabase() {
    const dbName = await Storage.get({ key: DB_NAME_KEY });
    await Storage.set({ key: DB_SETUP_KEY, value: null });
    return CapacitorSQLite.deleteDatabase({ database: dbName.value });
  }

}
