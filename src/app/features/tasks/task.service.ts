import { Injectable, inject } from '@angular/core';
import { HttpService, HttpResult } from '../../core/http/http.service';
import { Task, CreateTaskDTO, UpdateTaskDTO, PaginatedTasks } from '../../core/models/task.models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpService);

  async getAll(limit?: number, lastId?: string): Promise<HttpResult<PaginatedTasks>> {
    const params: Record<string, string> = {};
    if (limit) params['limit'] = limit.toString();
    if (lastId) params['lastId'] = lastId;
    return this.http.get<PaginatedTasks>('/tasks', params);
  }

  async create(data: CreateTaskDTO): Promise<HttpResult<Task>> {
    return this.http.post<Task>('/tasks', data);
  }

  async update(id: string, data: UpdateTaskDTO): Promise<HttpResult<Task>> {
    return this.http.patch<Task>(`/tasks/${id}`, data);
  }

  async delete(id: string): Promise<HttpResult<void>> {
    return this.http.delete<void>(`/tasks/${id}`);
  }
}