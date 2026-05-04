import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  taskCreated = output<{ title: string; description: string }>();
  cancel = output<void>();

  title = signal('');
  description = signal('');
  submitting = signal(false);

  async onSubmit(): Promise<void> {
    const titleValue = this.title().trim();
    if (!titleValue) return;

    this.submitting.set(true);
    this.taskCreated.emit({
      title: titleValue,
      description: this.description().trim(),
    });

    this.title.set('');
    this.description.set('');
    this.submitting.set(false);
  }
}