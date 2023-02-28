import {Injectable} from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, webFrame} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import {Configuration} from '../configuration/entity/configuration';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ConfigurationService} from "../configuration/configuration.service";
import {ImageProcessingService} from "../image-processing/image-processing.service";

@Injectable({
  providedIn: 'root'
})
export class ElectronService{
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor(private http: HttpClient,
              private configurationService: ConfigurationService,
              private imageProcessingService:ImageProcessingService) {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;

      this.fs = window.require('fs');

      this.childProcess = window.require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout:\n${stdout}`);
      });

      this.ipcRenderer.on('error', (event, url) => {
      });

      // this.ipcRenderer.on('server-change', (event, serverPath) => {
      //   console.log(serverPath);
      //   this.configurationService.getBase64Icon(serverPath).then(image => {
      //     const base64icon = 'data:image/jpeg;base64,'+ image;
      //     this.imageProcessingService.getTaskBarIconNoColor(base64icon).then(modifiedImage => {
      //       this.setApplicationIcon(modifiedImage);
      //       this.loadUrl(serverPath);
      //     });
      //   });
      // });
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  public setApplicationIcon(base64: string): void {
    this.ipcRenderer.send('icon', base64);
  }

  public loadQuarter(quarter: string): void {
    this.findServerUrlFlag().then(url => {
      this.loadUrl(url + '/cs-client/' + quarter);
    });
  }

  public loadUrl(url: string): void {
    this.ipcRenderer.send('loadURL', url);
  }

  async findServerUrlFlag(): Promise<string> {
    return await this.ipcRenderer.invoke('server-flag');
  }

  loadFullURL(serverPath: string, quarter: string) {
    this.loadUrl(serverPath + '/cs-client/' + quarter);
  }


}
