import { Component, inject, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet } from "@ionic/angular/standalone";
import { IonIcon } from "@ionic/angular/standalone";
import { home, person, cart, settings } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ModuleService } from 'src/app/Services/module.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Module } from 'src/app/Interfaces/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [IonTabs, IonTabBar, IonRouterOutlet, IonTabButton, IonIcon, IonLabel,RouterLink,CommonModule],
})
export class TabsComponent  implements OnInit {
  moduleService = inject(ModuleService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  constructor() {
    addIcons({ home, person, cart, settings });
  }
  tabs! : Module []
  ngOnInit() {

    this.moduleService.modules$.subscribe(
      (modules) => {
          this.tabs = modules.map(m=> ({...m,avatar: `assets/svgs/${m.avatar}.svg`}))
          console.log(this.tabs)
      }
    )
  }
  onTabClick (id:string | undefined | number) {
    console.log(id)

    this.router.navigate(['tabs','tab',id]);

  }
}
