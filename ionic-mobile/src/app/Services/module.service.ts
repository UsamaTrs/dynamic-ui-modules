import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Module {
  _id?: string;
  title: string;
  avatar: string;
  bgColor: string;
  fontColor: string;
}

export interface ScreenSettings {
  _id?: string;
  bgColor: string;
  fontColor: string;
  fontFamily: string;
  headings: {
    line1: string;
    line2: string;
  };
  text: string;
}

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
    this.socket.on('modules', (modules: Module[]) => {
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
  loadScreenSettings() {
    this.http.get<ScreenSettings>(`${this.apiUrl}/screen-settings`).subscribe({
      next: (settings) => {
        console.log('Loaded screen settings:', settings);
        this.screenSettingsSubject.next(settings);
      },
      error: (error) => {
        console.error('Error loading screen settings:', error);
      }
    });
  }

  // Only load modules - no CRUD operations
  loadModules() {
    this.http.get<Module[]>(`${this.apiUrl}/modules`).subscribe({
      next: (modules) => {
        console.log('Loaded modules:', modules);
        this.modulesSubject.next(modules);
      },
      error: (error) => {
        console.error('Error loading modules:', error);
      }
    });
  }
}
