import { Component, computed, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, NgClass } from "@angular/common";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, NgClass, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  isSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();

  sizeClass = computed(()=>{
    const isSidebarCollapsed = this.isSidebarCollapsed();
    if(isSidebarCollapsed){
      return '';
    }
    return this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen';
  })

}
