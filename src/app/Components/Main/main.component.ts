import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

interface Module {
  id: number | string;
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
export class MainComponent {
  //screen
  bgColor: string = '#e0e0e0'; // Default white color matching the input's value
  fontColor: string = '#333333';
  fontFamily: string = 'Poppins';
  s_heading1 : string = 'What Brings You';
  s_heading2 : string = 'to Silent Moon?';
  s_text :string = 'choose a topic to focus on:'
  //Modules
  newMode: boolean = false;
  editMode: boolean = false;
  originalModule?: Module;
  undoMode: boolean = false;
  moduleForm: Module = {
    id: '',
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

  modulesArr: Module[] = [
    {
      id: 1,
      title: 'Reduce Stress',
      avatar: `assets/svgs/${this.avatars[0]}.svg`,
      bgColor: '#ead2ef',
      fontColor: '#615959FF',
    },
    {
      id: 2,
      title: 'Improve Sleep',
      avatar: `assets/svgs/${this.avatars[1]}.svg`,
      bgColor: '#b3c5ee',
      fontColor: '#FFFFFFFF',
    },
    {
      id: 3,
      title: 'Increase Focus',
      avatar: `assets/svgs/${this.avatars[2]}.svg`,
      bgColor: '#d6f0df',
      fontColor: '#000000FF',
    },
    {
      id: 4,
      title: 'Daily Calm',
      avatar: `assets/svgs/${this.avatars[3]}.svg`,
      bgColor: '#e8fdee',
      fontColor: '#333333',
    },
    {
      id: 5,
      title: 'Anxiety Relief',
      avatar: `'assets/svgs/${this.avatars[4]}.svg`,
      bgColor: '#eec7c2',
      fontColor: '#333333',
    },
  ];

  modules = this.modulesArr.map((m: Module, i: number) => ({
    ...m,
    avatar: `assets/svgs/${this.avatars[i]}.svg`,
  }));

  newModuleSubmit(form: NgForm) {
    if (form.valid) {
      //  console.log(form.value)
      //  console.log(this.moduleForm)
      let newForm = this.moduleForm;
      newForm = {
        ...newForm,
        avatar: `assets/svgs/${this.moduleForm.avatar}.svg`,
        id: Date.now(),
      };
      //  console.log(newForm)
      this.modules = [...this.modules, newForm];
      this.moduleForm = {
        id: '',
        title: '',
        avatar: '',
        bgColor: '#ffffff',
        fontColor: '#333333',
      };
    }
  }
  moduleClickHandler(module: Module, event: Event) {
    document.querySelector('.selected')?.classList.remove('selected');
    (event.currentTarget as HTMLElement).classList.toggle('selected');
    const index = this.modules.findIndex((m) => m.id === module.id);
    this.originalModule = this.modules[index];
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
    if (this.moduleForm.id) {
      console.log(`formchange`, this.moduleForm);
      const index = this.modules.findIndex((m) => m.id === this.moduleForm.id);
      if (index !== -1) {
        let avatar = `assets/svgs/${this.moduleForm.avatar}.svg`;
        this.modules[index] = { ...this.moduleForm, avatar };
        this.modules = [...this.modules]; // Force refresh
      }
    }
  }
  onSave(form: NgForm) {
    document.querySelector('.selected')?.classList.remove('selected');
    this.editMode = false;
    this.moduleForm = {
      id: '',
      title: '',
      avatar: '',
      bgColor: '#ffffff',
      fontColor: '#333333',
    };
    console.log(form);
  }
  onDiscard() {
    document.querySelector('.selected')?.classList.remove('selected');
    this.editMode = false;
    if (this.moduleForm.id) {
      const index = this.modules.findIndex((m) => m.id === this.moduleForm.id);
      if (index !== -1 && this.originalModule) {
        this.modules[index] = this.originalModule;
      }
    }
    this.moduleForm = {
      id: '',
      title: '',
      avatar: '',
      bgColor: '#ffffff',
      fontColor: '#333333',
    };
  }
  onReset() {
    if (this.moduleForm.id) {
      let updatedModule = this.originalModule;
      if (updatedModule) {
        let avatar = updatedModule.avatar.split('svgs/')[1].split('.')[0];
        updatedModule = { ...updatedModule, avatar };
        this.moduleForm = updatedModule;
      }
    }
  }
  onNew() {
    document.querySelector('.selected')?.classList.remove('selected');
    this.editMode = false;
    this.moduleForm = {
      id: '',
      title: '',
      avatar: '',
      bgColor: '#ffffff',
      fontColor: '#333333',
    };
  }
  onDelete() {
    if (this.originalModule) {
      console.log(this.originalModule);
      const index = this.modules.findIndex(
        (m) => m.id === this.originalModule?.id
      );
      this.modules = this.modules.filter((m, i) => i !== index);
      console.log(this.modules);
      this.moduleForm = {
        id: '',
        title: '',
        avatar: '',
        bgColor: '#ffffff',
        fontColor: '#333333',
      };
      this.undoMode = true;
    }
  }
  onUndo() {
    if (this.originalModule) {
      console.log(this.originalModule.id)

      let undoModule = this.originalModule;
      let avatar = undoModule.avatar.split('svgs/')[1].split('.')[0];
      undoModule = { ...undoModule, avatar };
      this.moduleForm = undoModule;
      avatar = `assets/svgs/${undoModule.avatar}.svg`
      console.log(this.moduleForm)
      this.modules = [{...this.moduleForm,avatar},...this.modules]
      this.undoMode = false;
    }
  }
}
