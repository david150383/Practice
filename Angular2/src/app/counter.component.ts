import { Component } from '@angular/core';
import { ChildComponent } from './child.component';
@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [ChildComponent],
  template: `<app-child [message]="parentMessage" (dataSent)="handleData($event)"></app-child>
    <p>Received: {{ receivedMessage }}</p> `,
})
export class CounterComponent {
  receivedMessage = '';

  handleData(message: string) {
    this.receivedMessage = message;
  }
  parentMessage = 'Hello from parent';
}
