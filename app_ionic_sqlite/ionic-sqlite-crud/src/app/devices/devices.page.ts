import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {
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
    });
    return true;

    }

}
