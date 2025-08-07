import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Module } from '../Interfaces/module_Interface';
@Injectable({
  providedIn: 'root',
})
export class  ModuleService {
  http = inject(HttpClient);

  constructor() {}
  api = `http://localhost:3000/modules/`;

  getModules() {
    return this.http.get(this.api);
  }

  createModule(module: Module) {
    return this.http.post(this.api, module);
  }

  updateModule(id: string | number, module: Module) {
    console.log(this.api + id)
    return this.http.put(this.api + id, module);
  }

  deleteModule(id: number | string) {
    return this.http.delete(this.api + id);
  }
}
