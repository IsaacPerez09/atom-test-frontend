import { Component, signal, computed, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { TaskService } from '../../task.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Task } from '../../../../core/models/task.models';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule, TaskFormComponent, DatePipe, A11yModule],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  tasks = signal<Task[]>([]);
  hasMore = signal(false);
  loading = signal(true);
  loadingMore = signal(false);
  error = signal<string | null>(null);

  private readonly PAGE_LIMIT = 5;

  editingTask = signal<Task | null>(null);
  deletingTask = signal<Task | null>(null);
  creatingTask = signal(false);
  editTitle = signal('');
  editDescription = signal('');
  editSubmitting = signal(false);

  readonly sortedTasks = computed(() => {
    return [...this.tasks()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  readonly pendingTasks = computed(() => this.sortedTasks().filter(t => !t.completed));
  readonly completedTasks = computed(() => this.sortedTasks().filter(t => t.completed));

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.editingTask()) {
      this.cancelEdit();
    } else if (this.deletingTask()) {
      this.cancelDelete();
    } else if (this.creatingTask()) {
      this.cancelCreate();
    }
  }

  async ngOnInit(): Promise<void> {
    await this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    const result = await this.taskService.getAll(this.PAGE_LIMIT);

    if (!result.success && result.error) {
      this.error.set(result.error.message);
      this.loading.set(false);
      return;
    }

    if (result.data) {
      this.tasks.set(result.data.tasks);
      this.hasMore.set(result.data.hasMore);
    } else {
      this.tasks.set([]);
      this.hasMore.set(false);
    }
    this.loading.set(false);
  }

  async loadMore(): Promise<void> {
    if (!this.hasMore() || this.loadingMore()) return;
    this.loadingMore.set(true);
    this.error.set(null);

    const currentTasks = this.sortedTasks();
    if (currentTasks.length === 0) return;

    const lastId = currentTasks[currentTasks.length - 1].id;

    const result = await this.taskService.getAll(this.PAGE_LIMIT, lastId);

    if (!result.success && result.error) {
      this.error.set(result.error.message);
      this.loadingMore.set(false);
      return;
    }

    if (result.data) {
      this.tasks.update(current => [...current, ...result.data!.tasks]);
      this.hasMore.set(result.data.hasMore);
    }
    this.loadingMore.set(false);
  }

  openCreateModal(): void {
    this.creatingTask.set(true);
  }

  cancelCreate(): void {
    this.creatingTask.set(false);
  }

  async onTaskCreated(taskData: { title: string; description: string }): Promise<void> {
    const result = await this.taskService.create(taskData);

    if (!result.success && result.error) {
      this.error.set(result.error.message);
      return;
    }

    if (result.data) {
      this.tasks.update(current => [result.data!, ...current]);
      this.creatingTask.set(false);
    }
  }

  async onToggleComplete(task: Task): Promise<void> {
    const result = await this.taskService.update(task.id, { completed: !task.completed });

    if (!result.success && result.error) {
      this.error.set(result.error.message);
      return;
    }

    if (result.data) {
      this.tasks.update(current =>
        current.map(t => t.id === task.id ? result.data! : t)
      );
    }
  }

  onDeleteTask(task: Task): void {
    this.deletingTask.set(task);
  }

  cancelDelete(): void {
    this.deletingTask.set(null);
  }

  async confirmDelete(): Promise<void> {
    const task = this.deletingTask();
    if (!task) return;

    const result = await this.taskService.delete(task.id);

    if (!result.success && result.error) {
      this.error.set(result.error.message);
      return;
    }

    this.tasks.update(current => current.filter(t => t.id !== task.id));
    this.deletingTask.set(null);
  }

  onEditTask(task: Task): void {
    this.editingTask.set(task);
    this.editTitle.set(task.title);
    this.editDescription.set(task.description || '');
  }

  cancelEdit(): void {
    this.editingTask.set(null);
  }

  async submitEdit(): Promise<void> {
    const task = this.editingTask();
    if (!task) return;

    this.editSubmitting.set(true);

    const result = await this.taskService.update(task.id, {
      title: this.editTitle(),
      description: this.editDescription()
    });

    this.editSubmitting.set(false);

    if (!result.success && result.error) {
      this.error.set(result.error.message);
      return;
    }

    if (result.data) {
      this.tasks.update(current => current.map(t => t.id === task.id ? result.data! : t));
    }

    this.editingTask.set(null);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  clearError(): void {
    this.error.set(null);
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}