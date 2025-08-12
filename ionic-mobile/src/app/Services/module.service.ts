import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Module, ScreenSettings } from '../Interfaces/interfaces';
// here when is this service gonna run like waht the priorities or the sequence ofexecution cuz in homepage.ts i have subscribed to modules and screensettings subject but when i run my app the it couldnt get data from these subjects and subjects return like empty why and i need to liek ctrl + s inside tabs html which then recall the service and then homepage and modules like the cards containing data starts working and get unstuck whcih they are when we run app for  the first time


@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = 'http://localhost:3000';
  private socket: Socket;
  private modulesSubject = new BehaviorSubject<Module[]>([]);
  private screenSettingsSubject = new BehaviorSubject<ScreenSettings | null>(null);

  modules$ = this.modulesSubject.asObservable();
  screenSettings$ = this.screenSettingsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Connect to Socket.IO for real-time updates
    this.socket = io('http://localhost:3000');

    // Listen for real-time updates from web app
    this.socket.on('modules', async (modules: Module[]) => {
      console.log('Received real-time modules from web app:', modules);
      this.modulesSubject.next(modules);
    });
    this.socket.on('screenSettings', (settings: ScreenSettings) => {
      console.log('Received real-time screen settings:', settings);
      this.screenSettingsSubject.next(settings);
    });

    // Load initial data
  this.loadModules();
  this.loadScreenSettings();
  }
    // Screen settings methods
  async loadScreenSettings () {
  let settings = await firstValueFrom(this.http.get<ScreenSettings>(`${this.apiUrl}/screen-settings`))
  this.screenSettingsSubject.next(settings)
  }

  // Only load modules - no CRUD operations
  async loadModules() {
   let modules = await firstValueFrom( this.http.get<Module[]>(`${this.apiUrl}/modules`))
   this.modulesSubject.next(modules)
  }
}
