import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-battery',
  templateUrl: './battery.page.html',
  styleUrls: ['./battery.page.scss'],
})
export class BatteryPage implements OnInit {
  devices:any = [];
  batteries:any = [
    {
      id: 0,
      name: '',
      date_of_purchase: '',
      number_of_cycles: 0,
      last_cycle_date: '',
      device_id: 0
    }
  ];
  currentDevice : string = "";
  batteryInput : any = [];
  todayDate: String = new Date().toISOString();
  default_cycle_value : number = 0;
  confirmDelete : boolean = false;
  editMode : boolean = false;
  addOrEdit : string = "Add";
  inputMode : boolean = false;

  constructor(public database: DatabaseService, private platform: Platform) {
    this.database.createDatabase().then(() => {
      // will call the getDevices() function after the database is created
      this.getAllDevices();
      this.getAllBatteries();
      this.addOrEdit = "Add";
    });

    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
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

  getAllBatteries(filter : string = '') {
    this.database.getAllBatteries(filter).then((data) => {
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
    await this.database.getDeviceByName(this.currentDevice).then((data) => {
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
      this.database.editBattery(this.batteryInput.id,
        this.batteryInput.name,
        this.batteryInput.device_id,
        this.batteryInput.date_of_purchase,
        this.batteryInput.number_of_cycles,
        this.batteryInput.last_cycle_date).then((data) => {
        alert('Battery updated');
      });
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
  this.editMode = false;
  this.batteryInput.name = '';
  this.batteryInput.device_id = 0;
  this.currentDevice = '';
  this.batteryInput.date_of_purchase = '';
  this.batteryInput.number_of_cycles = 0;
  this.batteryInput.last_cycle_date = '';

  this.inputMode = false;
  this.getAllBatteries();
  this.addOrEdit = "Add";
  return true;
}

  async editBattery(_battery : any) {
      //alert('edit');

      this.editMode = true;
      this.batteryInput.id = _battery.bat_id;
      this.batteryInput.name = _battery.bat_name;
      this.batteryInput.device_id = _battery.device_id;
      this.currentDevice = _battery.dev_name;
      this.batteryInput.date_of_purchase = _battery.date_of_purchase;
      this.batteryInput.number_of_cycles = _battery.number_of_cycles;
      this.batteryInput.last_cycle_date = _battery.last_cycle_date;
      this.addOrEdit = "Edit";
    }

    async deleteBattery(_battery : any) {

      this.confirmDelete = confirm('Are you sure you want to delete this battery?');

      if (!this.confirmDelete) {
        return false;
      }
      else
      {
        this.database.deleteBattery(_battery.bat_id).then((data) => {
          alert('Battery deleted');
        });
        this.getAllBatteries();
        return true;
      }
    }

    async searchBattery(ev: any) {
      const val = ev.target.value;
      if (val && val.trim() != '') {
        this.getAllBatteries(val);
      }
      else {
        this.getAllBatteries();
      }
    }

    addClick(ev: any) {
      this.inputMode = !this.inputMode;
    }

    abortAdd() {
      this.inputMode = false;
    }

    showBatteryDetails(_battery : any) {
      alert('Battery name: ' + _battery.bat_name + '\n\nDate of purchase: ' + _battery.bat_substr_date_purchase + '\n\nNumber of cycles: ' + _battery.number_of_cycles + '\n\nLast cycle date: ' + _battery.bat_substr_date);
    }

}
