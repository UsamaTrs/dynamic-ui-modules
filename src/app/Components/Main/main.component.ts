import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ModuleService } from '../../Services/module.service';

interface Module {
  _id?: number | string;
  title: string;
  avatar: string;
  bgColor: string;
  fontColor: string;
}

@Component({
  selector: 'app-main',
  imports: [FormsModule, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  //Injections
  moduleService = inject(ModuleService);

  //Html Variables
  @ViewChild('borderDiv') borderDiv!: ElementRef;

  //screen
  bgColor: string = '#e0e0e0'; // Default white color matching the input's value
  fontColor: string = '#333333';
  fontFamily: string = 'Poppins';
  s_heading1: string = 'What Brings You';
  s_heading2: string = 'to Silent Moon?';
  s_text: string = 'choose a topic to focus on:';

  //Modules
  modules?: Module[];

  timeOutId : any = null
  newMode: boolean = false;
  editMode: boolean = false;
  originalModule?: Module;
  undoMode: boolean = false;
  moduleForm: Module = {
    // _id: '',
    title: '',
    avatar: '',
    bgColor: '#ffffff',
    fontColor: '#333333',
  };

  avatars: string[] = [
    'better-sleep',
    'growth',
    'happiness',
    'meditation',
    'performance',
  ];

  fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Palatino',
    'Garamond',
    'Bookman',
    'Comic Sans MS',
    'Trebuchet MS',
    'Impact',
    'Poppins',
  ];

  // modulesArr: Module[] = [
  //   {
  //     _id: 1,
  //     title: 'Reduce Stress',
  //     avatar: `assets/svgs/${this.avatars[0]}.svg`,
  //     bgColor: '#ead2ef',
  //     fontColor: '#615959FF',
  //   },
  //   {
  //     _id: 2,
  //     title: 'Improve Sleep',
  //     avatar: `assets/svgs/${this.avatars[1]}.svg`,
  //     bgColor: '#b3c5ee',
  //     fontColor: '#FFFFFFFF',
  //   },
  //   {
  //     _id: 3,
  //     title: 'Increase Focus',
  //     avatar: `assets/svgs/${this.avatars[2]}.svg`,
  //     bgColor: '#d6f0df',
  //     fontColor: '#000000FF',
  //   },
  //   {
  //     _id: 4,
  //     title: 'Daily Calm',
  //     avatar: `assets/svgs/${this.avatars[3]}.svg`,
  //     bgColor: '#e8fdee',
  //     fontColor: '#333333',
  //   },
  //   {
  //     _id: 5,
  //     title: 'Anxiety Relief',
  //     avatar: `'assets/svgs/${this.avatars[4]}.svg`,
  //     bgColor: '#eec7c2',
  //     fontColor: '#333333',
  //   },
  // ];

  // modules = this.modulesArr.map((m: Module, i: number) => ({
  //   ...m,
  //   avatar: `assets/svgs/${this.avatars[i]}.svg`,
  // }));
  ngOnInit(): void {
    this.loadModules()
  }
  loadModules(){
    this.moduleService.getModules().subscribe({
      next: (modules: any) => {
        console.log(modules);
        this.modules = modules.map((m: Module) => ({
          ...m,
          avatar: `assets/svgs/${m.avatar}.svg`,
        }));
        console.log(this.modules);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onCreateNew(form: NgForm) {
      let newForm = this.moduleForm;
      this.moduleService.createModule(newForm).subscribe({
        next:(response) => {
           console.log(response)
           this.moduleForm = {
            // _id: '',
            title: '',
            avatar: '',
            bgColor: '#ffffff',
            fontColor: '#333333',
        }
        this.loadModules()
        },
      })

  }
  moduleClickHandler(module: Module, event: Event) {
    document.querySelector('.selected')?.classList.remove('selected');
    (event.currentTarget as HTMLElement).classList.toggle('selected');
    const index = this.modules!.findIndex((m) => m._id === module._id);
    this.originalModule = this.modules![index];
    console.log(`originalmodule`, this.originalModule);
    this.editMode = true;
    let updatedModule = module;
    let avatar = updatedModule.avatar.split('svgs/')[1].split('.')[0];
    updatedModule = { ...updatedModule, avatar };
    this.moduleForm = updatedModule;
    console.log(`moduleformhandler`, this.moduleForm);
  }
  onFormChange() {
    console.log('moduleForm', this.moduleForm);
    if (this.moduleForm._id) {
      console.log(`formchange`, this.moduleForm);
      const index = this.modules!.findIndex((m) => m._id === this.moduleForm._id);
      if (index !== -1) {
        let avatar = `assets/svgs/${this.moduleForm.avatar}.svg`;
        this.modules![index] = { ...this.moduleForm, avatar };
        this.modules = [...this.modules!]; // Force refresh
      }
    }
  }
  onSave(form: NgForm) {
    document.querySelector('.selected')?.classList.remove('selected');
    if (this.moduleForm._id) {
     this.moduleService.updateModule(this.moduleForm._id, this.moduleForm).subscribe({
      next:(response)=>{
           console.log(response)
           this.editMode = false;
           this.moduleForm = {
            // _id: '',
            title: '',
            avatar: '',
            bgColor: '#ffffff',
            fontColor: '#333333',
          };
          this.loadModules()
      },
      error(err) {
        console.log(err)
      },
     });
    }



  }
  onDiscard() {
    document.querySelector('.selected')?.classList.remove('selected');
    this.editMode = false;
    if (this.moduleForm._id) {
      const index = this.modules!.findIndex((m) => m._id === this.moduleForm._id);
      if (index !== -1 && this.originalModule) {
        this.modules![index] = this.originalModule;
      }
    }
    this.moduleForm = {
      // _id: '',
      title: '',
      avatar: '',
      bgColor: '#ffffff',
      fontColor: '#333333',
    };
  }
  onReset() {
    console.log(this.moduleForm)
    if (this.moduleForm._id) {
      let updatedModule = this.originalModule;
    console.log(this.originalModule)

      if (updatedModule) {
        const index = this.modules?.findIndex(m=>m._id === updatedModule!._id)
        let avatar = updatedModule.avatar.split('svgs/')[1].split('.')[0];

        if(index) {
          updatedModule = { ...updatedModule, avatar };
          this.modules![index] = {...updatedModule}
          this.moduleForm = updatedModule;
          console.log(this.moduleForm)
        }

      }
    }
  }
  onNew() {
    document.querySelector('.selected')?.classList.remove('selected');
    this.editMode = false;
    this.moduleForm = {
      // _id: '',
      title: '',
      avatar: '',
      bgColor: '#ffffff',
      fontColor: '#333333',
    };
  }
  onDelete() {
    if (this.originalModule?._id) {
      this.borderDiv.nativeElement.classList.add('running-border')
      const id  = this.originalModule._id
      console.log(this.originalModule);
      const index = this.modules!.findIndex(
        (m) => m._id === this.originalModule?._id
      );
      this.modules = this.modules!.filter((m, i) => i !== index);
      console.log(this.modules);
      this.moduleForm = {
        // _id: '',
        title: '',
        avatar: '',
        bgColor: '#ffffff',
        fontColor: '#333333',
      };
      this.undoMode = true;
       this.timeOutId=  setTimeout(() => {
      this.moduleService.deleteModule(id).subscribe({
        next:(response)=> {
           console.log(response)
           this.editMode=false
           this.loadModules()
        },
        error(err) {
          console.log(err)
        },
      })
    }, 10000);
    }
  }
  onUndo() {
    if (this.originalModule) {
      this.borderDiv.nativeElement.classList.remove('running-border')

      console.log(this.originalModule._id);
      clearTimeout(this.timeOutId!)
      let undoModule = this.originalModule;
      let avatar = undoModule.avatar.split('svgs/')[1].split('.')[0];
      undoModule = { ...undoModule, avatar };
      this.moduleForm = undoModule;
      avatar = `assets/svgs/${undoModule.avatar}.svg`;
      console.log(this.moduleForm);
      this.modules = [{ ...this.moduleForm, avatar }, ...this.modules!];
      this.undoMode = false;
    }
  }
}
