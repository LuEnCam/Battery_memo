import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  databaseObj: SQLiteObject | undefined;
  tables = {
    batteries: 'batteries',
    devices: 'devices',
  };
  deviceTableExists: boolean | undefined;

  constructor(private sqlite: SQLite) { }

  async createDatabase() {
    // Create database
    await this.sqlite.create({
      name: 'data_batteries.db',
      location: 'default',
    }).then((db : SQLiteObject) => {
      this.databaseObj = db;
      alert('Database created');
    }).catch(e => { alert("error on creating database" + JSON.stringify(e)); });

    await this.createTables();

  }


  async createTables() {
    // Create tables
    await this.databaseObj?.executeSql(`
      CREATE TABLE IF NOT EXISTS ${this.tables.devices} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL`
        , []);

    this.deviceTableExists = await this.checkIfTableExists(this.tables.devices);

    if (this.deviceTableExists) {
      await this.insertIntoDevicesTable('Other');
      await this.insertIntoDevicesTable('Telefon');
      await this.insertIntoDevicesTable('Laptop');
      await this.insertIntoDevicesTable('Tablet');
      await this.insertIntoDevicesTable('Camera');
      await this.insertIntoDevicesTable('Drone');
      await this.insertIntoDevicesTable('Smartwatch');
      await this.insertIntoDevicesTable('Headphones');
      await this.insertIntoDevicesTable('Powerbank');
      await this.insertIntoDevicesTable('Car');
      await this.insertIntoDevicesTable('Bike');
      await this.insertIntoDevicesTable('Scooter');
      await this.insertIntoDevicesTable('Game console');
      await this.insertIntoDevicesTable('remote control');
      await this.insertIntoDevicesTable('Toy');
      await this.insertIntoDevicesTable('AA batteries');
      await this.insertIntoDevicesTable('AAA batteries');
      await this.insertIntoDevicesTable('C batteries');
      await this.insertIntoDevicesTable('D batteries');
    }

    await this.databaseObj?.executeSql(`
      CREATE TABLE IF NOT EXISTS ${this.tables.batteries} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        device_id INTEGER UNSIGNED NOT NULL DEFAULT 0,
        date_of_purchase TEXT,
        number_of_cycles INTEGER,
        last_cycle_date TEXT,
        FOREIGN KEY (device_id) REFERENCES ${this.tables.devices}(id))`
      , []);
  }

  async checkIfTableExists(tableName: string) {
    await this.databaseObj?.executeSql(`
      SELECT name FROM sqlite_master WHERE type='table' AND name=?`
      , [tableName]).then((res) => {
        if (res.rows.length > 0) {
          return true;
        } else {
          return false;
        }
      }).catch(e => { console.log("error on checking if table exists" + JSON.stringify(e)); });
      return false;
    }

  // Functions CRUD for Devices table

  async insertIntoDevicesTable(name: string) {
    await this.databaseObj?.executeSql(`
      INSERT INTO ${this.tables.devices} (name) VALUES (?)`
      , [name]).then(() => { return 'Device added'; }).catch(e => {
        if (e.code === 6) {
          console.log('Device already exists');
        }
        console.log("error on inserting into devices table" + JSON.stringify(e)); });
  }

  async getAllDevices() {
    return this.databaseObj?.executeSql(`
      SELECT * FROM ${this.tables.devices} ORDER BY name ASC`
      , []).then((res) => {
        alert(JSON.stringify(res));
        return res;
      }).catch(e => { console.log("error on getting devices" + JSON.stringify(e)); });


  }

  async deleteDevice(id: number) {
    return this.databaseObj?.executeSql(`
      DELETE FROM ${this.tables.devices} WHERE id = ?`
      , [id]).then((res) => {
        return res;
      }).catch(e => { console.log("error on deleting device" + JSON.stringify(e)); });
  }

  async editDevice(id: number, name: string) {
    return this.databaseObj?.executeSql(`
      UPDATE ${this.tables.devices} SET name = ? WHERE id = ?`
      , [name, id]).then((res) => {
        console.log('Device edited');
      }).catch(e => { console.log("error on editing device" + JSON.stringify(e)); });
  }

}
