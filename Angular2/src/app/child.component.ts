import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  template: ` <p>Message from parent: {{ message }}</p>
    <button (click)="sendData()">Send to Parent</button>`,
})
export class ChildComponent {
  @Output() dataSent = new EventEmitter<string>();
  @Input() message!: string;

  sendData() {
    this.dataSent.emit('Hello from child 👋');
  }
}
