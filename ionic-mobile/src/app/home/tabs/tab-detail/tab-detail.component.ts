import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Module } from 'src/app/Interfaces/interfaces';
import { ModuleService } from 'src/app/Services/module.service';

@Component({
  selector: 'app-tab-detail',
  templateUrl: './tab-detail.component.html',
  styleUrls: ['./tab-detail.component.scss'],
})
export class TabDetailComponent implements OnInit {

  moduleService = inject(ModuleService);
  route = inject(ActivatedRoute);
  module!: Module
  id!: string | null;

  constructor() { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.moduleService.modules$.subscribe(modules => {
        const foundModule = modules.find(m => m._id === this.id);
        if (foundModule) {
          this.module = {...foundModule, avatar: `assets/svgs/${foundModule.avatar}.svg`};
        } else {
          console.log(foundModule)
          // Handle the case where the module is not found, e.g., navigate away or show an error
          // For now, we can assign a default value or leave it undefined
          // this.module = {} as Module; // Uncomment if you want to assign an empty object
        }
      })
     })
  }
}
