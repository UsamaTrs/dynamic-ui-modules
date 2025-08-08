import { Component, inject, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet } from "@ionic/angular/standalone";
// import { IonRouterOutlet } from "../../../../node_modules/@ionic/angular/standalone/navigation/router-outlet";
// import { IonIcon } from "../../../../node_modules/@ionic/angular/standalone/directives/icon";
import { IonIcon } from "@ionic/angular/standalone";
import { home, person, cart, settings } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Module, ModuleService } from 'src/app/Services/module.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonTabs, IonTabBar, IonRouterOutlet, IonTabButton, IonIcon, IonLabel,RouterLink],
})
export class TabsComponent  implements OnInit {
  moduleService = inject(ModuleService)
  constructor() {
    addIcons({ home, person, cart, settings });
  }
  tabs : Module [] = []
  ngOnInit() {

    this.moduleService.modules$.subscribe(
      (modules) => {
          this.tabs = modules.map(m=> ({...m,avatar: `assets/svgs/${m.avatar}.svg`}))
          console.log(this.tabs)
      }
    )
  }

}
