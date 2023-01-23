import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit {
  devices:any = [];
  deviceName: string = '';

  constructor(public database: DatabaseService) {
    this.database.createDatabase().then(() => {
      // will call the getDevices() function after the database is created
      this.getAllDevices();
    });
   }

  ngOnInit() {}

  getAllDevices() {
    this.database.getAllDevices().then((data) => {
      this.devices = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.devices.push(data.rows.item(i));
        }
      }
    });
  }

  addDevice() {
    if (this.deviceName == '') {
      alert('Please enter device name');
      return false;
    }
    this.database.insertIntoDevicesTable(this.deviceName).then((data) => {
      this.deviceName = '';
      alert('Device added');
      this.getAllDevices();
      alert(JSON.stringify(this.devices));
    });
    return true;

    }

  deleteDevice(id : number) {
    this.database.deleteDevice(id).then((data) => {
      alert(data);
      this.getAllDevices();
    });
  }

}
