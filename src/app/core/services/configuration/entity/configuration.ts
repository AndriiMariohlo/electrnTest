export class Configuration {
  private _uuid: string
  private _id: string
  private _wert: string
  private _verschluesselt: number
  private _statusId: number
  private _benutzerId: string
  private _inputtype: string

  get uuid(): string {
    return this._uuid;
  }

  get id(): string {
    return this._id;
  }

  get wert(): string {
    return this._wert;
  }

  get verschluesselt(): number {
    return this._verschluesselt;
  }

  get statusId(): number {
    return this._statusId;
  }

  get benutzerId(): string {
    return this._benutzerId;
  }

  get inputtype(): string {
    return this._inputtype;
  }
}
