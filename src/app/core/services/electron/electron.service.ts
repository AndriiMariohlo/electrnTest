import {Injectable} from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, webFrame} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import {Configuration} from '../configuration/entity/configuration';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService{
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;
  private _serverPath: string;

  SETTINGS_API_PATH = '/admin/rest/settings/';
  ICON_PATH = '/admin/rest/appServConf/icon';

  constructor(private http: HttpClient) {
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
        // window.location.replace('http://localhost:4200/**');
        // alert('Error loading ' + url);
      });
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  get serverPath(): string {
    return this._serverPath;
  }

  set serverPath(value: string) {
    this._serverPath = value;
  }

  // public setApplicationIcon(base64: string): void {
  //   if (base64 && base64 != '') {
  //     const buffer = Buffer.from(base64, 'base64');
  //     this.remote.getCurrentWindow().setIcon(this.img.createFromBuffer(buffer))
  //   }
  // }

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

  async getServerUrl() {
    this.serverPath = await this.findServerUrlFlag();
  }

  loadFullURL() {
    this.findServerUrlFlag().then(url => {
        this.loadUrl(url + '/cs-client/');
      }
    );
  }


}
