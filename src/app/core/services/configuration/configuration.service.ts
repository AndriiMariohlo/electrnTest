import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Configuration} from "./entity/configuration";
import {ElectronService} from "..";

/**
 * Service for working with server configuration
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  SETTINGS_API_PATH = '/admin/rest/settings/';
  ICON_PATH = '/admin/rest/appServConf/icon';

  constructor(private http: HttpClient, private electronService: ElectronService) {
  }

  /**
   * Gets application start quarter
   */
  async getStartQuarter(serverPath: string): Promise<Configuration> {
    return await this.http.get<Configuration>(serverPath + this.SETTINGS_API_PATH + 'client_start_mit_abrechnungsquartal').toPromise();
  }

  /**
   * Gets application icon
   */
  async getBase64Icon(serverPath: string): Promise<string> {
    return await this.http.get(serverPath + this.ICON_PATH, {responseType: 'text'}).toPromise();
  }

}
