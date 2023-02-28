import {Component} from '@angular/core';
import {ElectronService} from './core/services';
import {TranslateService} from '@ngx-translate/core';
import {ConfigurationService} from './core/services/configuration/configuration.service';
import {ImageProcessingService} from './core/services/image-processing/image-processing.service';
import {RedirectedStateService} from './core/services/configuration/redirected-state.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  serverPath: string;
  quarter: string;
  isElectron: boolean;

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private configurationService: ConfigurationService,
    private imageProcessingService: ImageProcessingService,
  ) {
    this.translate.setDefaultLang('en');

    if (electronService.isElectron) {
      this.isElectron = true;

      this.electronService.ipcRenderer.invoke('change').then(serverPath => {
        console.log(serverPath);
        this.configurationService.getBase64Icon(serverPath).then(image => {
          const base64icon = 'data:image/jpeg;base64,' + image;
          this.imageProcessingService.getTaskBarIconNoColor(base64icon).then(modifiedImage => {
            this.electronService.setApplicationIcon(modifiedImage);
            this.configurationService.getStartQuarter(serverPath).then(conf => {
              const loadQuarter = conf.wert;
              this.electronService.loadFullURL(serverPath, loadQuarter);
            });
          });
        });
      }).catch(error => {
          console.log(error);
          console.log('Run in electron');
          this.electronService.findServerUrlFlag().then(url => {
            this.serverPath = url;
            this.configurationService.getBase64Icon(url).then(image => {
              const base64icon = 'data:image/jpeg;base64,' + image;
              this.imageProcessingService.getTaskBarIconNoColor(base64icon).then(modifiedImage => {
                this.electronService.setApplicationIcon(modifiedImage);
              });
            });
            this.configurationService.getStartQuarter(this.serverPath).then(conf => {
              this.quarter = conf.wert;
              this.electronService.loadFullURL(this.serverPath, this.quarter);
            }).catch(() => {
              console.log('Loading failed');
              alert('Loading failed');
            });
          }).catch(() => {
            console.log('Server flag not found');
            alert('Server flag not found');
          });
        });
      } else {
        this.isElectron = false;
        console.log('Run in browser');
      }
    }
  }
