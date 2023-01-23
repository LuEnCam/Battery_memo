import { Component } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Battery', url: '/pages/battery', icon: 'mail' },
    { title: 'Device', url: '/pages/device', icon: 'mail' },
/*     { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' }, */
  ];
  public labels = [/* 'Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders' */];
  constructor(
    private platform: Platform,
    private databaseService: DatabaseService,
    private loadingCtrl: LoadingController) {
      this.initializeApp();
    }

  async initializeApp() {
    this.platform.ready().then(async () => {
      const loading = await this.loadingCtrl.create();
      await loading.present();
      this.databaseService.init();
      this.databaseService.dbReady.subscribe(isReady => {
        if (isReady) {
          console.log('Database is ready');
          loading.dismiss();
        }
        console.log('Database is not ready')

      });
    });
  }

}
