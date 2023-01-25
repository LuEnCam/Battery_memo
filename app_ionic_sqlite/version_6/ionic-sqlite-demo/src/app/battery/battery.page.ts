import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.page.html',
  styleUrls: ['./battery.page.scss'],
})
export class BatteryPage implements OnInit {
  devices:any = [];
  batteries:any = [];
  currentDevice : string = "";
  batteryInput : any = [];
  todayDate: String = new Date().toISOString();
  default_cycle_value : number = 0;

  editMode : boolean = false;

  constructor(public database: DatabaseService) {
    this.database.createDatabase().then(() => {
      // will call the getDevices() function after the database is created
      this.getAllDevices();
      this.getAllBatteries();
    });
   }

  ngOnInit() {
  }

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

  getAllBatteries() {
    this.database.getAllBatteries().then((data) => {
      this.batteries = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.batteries.push(data.rows.item(i));
        }
      }
    });
  }

  async handleChange(ev: any) {
    this.currentDevice = ev.target.value;
    await this.database.getDeviceByIdByName(this.currentDevice).then((data) => {
      this.batteryInput.device_id = data.rows.item(0).id;
    });

  }

  addBattery() {
    if (this.currentDevice == undefined) {
      alert('Please select device');
      return false;
    }
    if (this.batteryInput.name == '') {
      alert('Please enter battery name');
      return false;
    }
    else if (this.batteryInput.date_of_purchase == '') {
      alert('Please enter date of purchase');
      return false;
    }
    else if (this.batteryInput.number_of_cycles  == '') {
      alert('Please enter number of cycles');
      return false;
    }
    else if (this.batteryInput.last_cycle_date == '') {
      alert('Please enter last cycle date');
      return false;
    }

    if (this.editMode) {
      this.database.editBattery(this.batteries.id,
        this.batteryInput.name,
        this.batteryInput.device_id,
        this.batteryInput.date_of_purchase,
        this.batteryInput.number_of_cycles,
        this.batteryInput.last_cycle_date).then((data) => {
        alert('Battery updated');
      });
      this.editMode = false;
      this.batteryInput.name = '';
      this.batteryInput.device_id = 0;
      this.batteryInput.date_of_purchase = '';
      this.batteryInput.number_of_cycles = 0;
      this.batteryInput.last_cycle_date = '';
    }
    else
    {

    this.database.InsertIntoBatteryTable(this.batteryInput.name,
      this.batteryInput.device_id,
      this.batteryInput.date_of_purchase,
      this.batteryInput.number_of_cycles,
      this.batteryInput.last_cycle_date).then((data) => {
      alert('Battery added');
    });
  }
  this.getAllBatteries();
  return true;
}

  editBattery(_battery : any) {
      alert('edit');



      this.editMode = true;
      this.batteryInput.id = _battery.id;
      this.batteryInput.name = _battery.name;
      this.batteryInput.device_id = _battery.device_id;
      this.batteryInput.date_of_purchase = _battery.date_of_purchase;
      this.batteryInput.number_of_cycles = _battery.number_of_cycles;
      this.batteryInput.last_cycle_date = _battery.last_cycle_date;
    }


}
