import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  databaseObj: SQLiteObject | undefined;
  tables = {
    batteries: 'batteries',
    devices: 'devices',
  };
  deviceTableExists: boolean = false;
  deviceTableEmpty: boolean = false;

  constructor(private sqlite: SQLite) { }

  async createDatabase() {
    // Create database
    await this.sqlite.create({
      name: 'data_batteries.db',
      location: 'default',
    }).then((db : SQLiteObject) => {
      this.databaseObj = db;
      //alert('Database created');

    }).catch(e => { alert("error on creating database" + JSON.stringify(e)); });

    // Create tables
    await this.createTables().then(() => {
      //alert('Tables created');
    } ).catch(e => { alert("error on creating tables" + JSON.stringify(e)); });
  }


  async createTables() {
    // Create tables
    await this.databaseObj?.executeSql(`
      CREATE TABLE IF NOT EXISTS ${this.tables.devices} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL)`
        , []);

    this.deviceTableExists =  await this.checkIfTableExists(this.tables.devices);
    this.deviceTableEmpty = await this.checkIfTableIsEmpty(this.tables.devices);

    if (this.deviceTableExists && this.deviceTableEmpty) {
      //alert('Table devices exists');
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
      await this.insertIntoDevicesTable('Remote control');
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

  async checkIfTableExists(tableName: string, temp : boolean = false) {
    temp = false;
    await this.databaseObj?.executeSql(`
      SELECT name FROM sqlite_master WHERE type='table' AND name=?`
      , [tableName]).then((res) => {
        if (res.rows.length > 0) {
          //alert('Table ' + tableName + ' exists');
          temp = true;
        } else {
          //alert('Table ' + tableName + ' does not exist');
          temp = false;
        }
      }).catch(e => { alert("error on checking if table exists" + JSON.stringify(e)); });
      return temp;
    }

  async checkIfTableIsEmpty(tableName: string, temp : boolean = false) {
    temp = false;
    await this.databaseObj?.executeSql(`
      SELECT * FROM ${tableName}`
      , []).then((res) => {
        if (res.rows.length > 0) {
          //alert('Table ' + tableName + ' is not empty');
          temp = false;
        } else {
          //alert('Table ' + tableName + ' is empty');
          temp = true;
        }
      }).catch(e => { alert("error on checking if table is empty" + JSON.stringify(e)); });
      return temp;
  }

  // Functions CRUD for Devices table

  async insertIntoDevicesTable(name: string) {
    await this.databaseObj?.executeSql(`
      INSERT INTO ${this.tables.devices} (name) VALUES (?)`
      , [name]).then(() => {
        //alert('Device inserted');
      }).catch(e => {
        if (e.code === 6) {
          alert('Device already exists');
        }
        alert("error on inserting into devices table" + JSON.stringify(e)); });
  }

  async InsertIntoBatteryTable(name: string, device_id: number, date_of_purchase: string, number_of_cycles: number, last_cycle_date: string) {
    await this.databaseObj?.executeSql(`
      INSERT INTO ${this.tables.batteries} (name, device_id, date_of_purchase, number_of_cycles, last_cycle_date) VALUES (?, ?, ?, ?, ?)`
      , [name, device_id, date_of_purchase, number_of_cycles, last_cycle_date]).then(() => {
        //alert('Battery inserted');
      }).catch(e => {
        if (e.code === 6) {
          alert('Battery already exists');
        }
        alert("error on inserting into batteries table" + JSON.stringify(e)); });
  }


  async getAllDevices() {
    return this.databaseObj?.executeSql(`
      SELECT * FROM ${this.tables.devices} ORDER BY name ASC`
      , []).then((res) => {
        //alert(JSON.stringify(res));
        return res;
      }).catch(e => { alert("error on getting devices" + JSON.stringify(e)); });


  }

  async getAllBatteries(filter : string = '') {
     let whereString  = '';
    if (filter != '') {
      whereString = `WHERE batteries.name LIKE "%${filter}%"`;
    }
    return this.databaseObj?.executeSql(`
      SELECT *, substr(batteries.last_cycle_date,1,10) as bat_substr_date,substr(batteries.date_of_purchase,1,10) as bat_substr_date_purchase , batteries.id as bat_id, devices.id as dev_id, batteries.name as bat_name, devices.name as dev_name FROM ${this.tables.batteries} LEFT JOIN devices ON devices.id=batteries.device_id ${whereString} ORDER BY bat_substr_date ASC`
      , []).then((res) => {
        //alert(JSON.stringify(res));
        return res;
      }).catch(e => { alert("error on getting batteries" + JSON.stringify(e)); });
  }



  async deleteDevice(id: number) {
    return this.databaseObj?.executeSql(`
      DELETE FROM ${this.tables.devices} WHERE id = ?`
      , [id]).then((res) => {
        return res;
      }).catch(e => { alert("error on deleting device" + JSON.stringify(e)); });
  }

  async deleteBattery(id: number) {
    return this.databaseObj?.executeSql(`
      DELETE FROM ${this.tables.batteries} WHERE id = ?`
      , [id]).then((res) => {
        return res;
      }).catch(e => { alert("error on deleting battery" + JSON.stringify(e)); });
  }


  async editDevice(id: number, name: string) {
    return this.databaseObj?.executeSql(`
      UPDATE ${this.tables.devices} SET name = ? WHERE id = ?`
      , [name, id]).then((res) => {
        //alert('Device edited');
      }).catch(e => { alert("error on editing device" + JSON.stringify(e)); });
  }

  async editBattery(id: number, name: string, device_id: number, date_of_purchase: string, number_of_cycles: number, last_cycle_date: string) {
    //alert("id :" + id + "\nname : " + name + "\ndevice_id : " + device_id + "\ndate_of_purchase : " + date_of_purchase + "\nnumber_of_cycles : " + number_of_cycles + "\nlast_cycle_date : " + last_cycle_date);
    return this.databaseObj?.executeSql(`
      UPDATE ${this.tables.batteries} SET name = ?, device_id = ?, date_of_purchase = ?, number_of_cycles = ?, last_cycle_date = ? WHERE id = ?`
      , [name, device_id, date_of_purchase, number_of_cycles, last_cycle_date, id]).then((res) => {

      }).catch(e => { alert("error on editing battery" + JSON.stringify(e)); });
  }


  async getDeviceByName(name: string) {
    return this.databaseObj?.executeSql(`
      SELECT * FROM ${this.tables.devices} WHERE name = ?`
      , [name]).then((res) => {
        //alert(JSON.stringify(res));
        return res;
      }).catch(e => { alert("error on getting device by name" + JSON.stringify(e)); });
  }

  async getDeviceNameById(id: number) {
    return this.databaseObj?.executeSql(`
      SELECT name FROM ${this.tables.devices} WHERE id = ?`
      , [id]).then((res) => {
        //alert(JSON.stringify(res));
        return res;
      }).catch(e => { alert("error on getting device name by id" + JSON.stringify(e)); });
  }

}
