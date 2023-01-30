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
  editMode : boolean = false;
  editDeviceId : number = 0;

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
    if (this.editMode) {
      //edit device
      this.database.editDevice(this.editDeviceId, this.deviceName).then((data) => {
        this.deviceName = '';
        this.editMode = false;

        alert('Device updated');
        //alert(JSON.stringify(this.devices));
      });
    } else {
      //add device
      this.database.insertIntoDevicesTable(this.deviceName).then((data) => {
        this.deviceName = '';
        alert('Device added');
        //alert(JSON.stringify(this.devices));
      });
    }
    this.getAllDevices();
    return true;

    }

  deleteDevice(id : number) {
    this.database.deleteDevice(id).then((data) => {
      //alert(data);
      this.getAllDevices();
    });
  }

  editDevice(_device : any) {
    this.editMode = true;
    this.deviceName = _device.name;
    this.editDeviceId = _device.id;
  }

}
