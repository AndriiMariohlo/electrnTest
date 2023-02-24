import {Component, OnInit} from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import {ConfigurationService} from './core/services/configuration/configuration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private configurationService: ConfigurationService
  ) {
    this.translate.setDefaultLang('en');

    if (electronService.isElectron) {
      console.log('Run in electron');
      this.electronService.loadFullURL();
    } else {
      console.log('Run in browser');
    }
  }

}
