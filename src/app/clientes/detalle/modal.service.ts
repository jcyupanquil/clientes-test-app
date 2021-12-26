import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  showing: boolean = false;
  private _notifyUpload = new EventEmitter<any>();

  constructor() { }

  get notifyUpload(): EventEmitter<any> {
    return this._notifyUpload;
  }

  showModal() {
    this.showing = true;
  }

  hideModal() {
    this.showing = false;
  }
}
