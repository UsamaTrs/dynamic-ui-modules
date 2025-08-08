// import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonTabButton, IonTabBar, IonLabel } from '@ionic/angular/standalone';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Module, ModuleService, ScreenSettings } from '../Services/module.service';
import { IonTabs, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { home, person, cart, settings } from 'ionicons/icons';
// import { IonIcon } from "../../../node_modules/@ionic/angular/standalone/directives/icon";
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule, IonTabButton, IonTabBar, IonTabs, IonLabel, IonIcon],
})
export class HomePage {
  constructor() {
    addIcons({ home, person, cart, settings });
  }
  private moduleService = inject(ModuleService);

  // Screen customization (same as web app)
  // bgColor: string = '#e0e0e0';
  // fontColor: string = '#333333';
  // fontFamily: string = 'Poppins';
  // s_heading1: string = 'What Brings You';
  // s_heading2: string = 'to Silent Moon?';
  // s_text: string = 'choose a topic to focus on:';

  // Modules (view-only)
  modules: Module[] = [];
  screen! : ScreenSettings

  ngOnInit() {
    // Subscribe to real-time module updates from web app
    this.moduleService.modules$.subscribe(modules => {
      this.modules = modules.map(module => ({
        ...module,
        avatar: `assets/svgs/${module.avatar}.svg`
      }));
      console.log('Updated modules in mobile app:', this.modules);
    });
    this.moduleService.screenSettings$.subscribe(
      (screenSettings: ScreenSettings | null) => {
        if (screenSettings) {
          this.screen = screenSettings;
        }
      }
    )
  }

  // Optional: Module click handler (just for visual feedback)
  onModuleClick(module: Module) {
    console.log('Module clicked:', module.title);
    // You could add haptic feedback or navigation here
  }
}
