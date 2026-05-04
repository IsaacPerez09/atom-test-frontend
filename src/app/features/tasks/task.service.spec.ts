import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { HttpService } from '../../core/http/http.service';
import { environment } from '../../../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;

  const mockTask = {
    id: 'task-1',
    userId: 'user-1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });

    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getAll', () => {
    it('should return paginated tasks', async () => {
      const mockResponse = {
        success: true,
        data: { tasks: [mockTask], hasMore: false },
        error: null,
      };

      const promise = service.getAll();

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/tasks`
      );
      req.flush(mockResponse);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data?.tasks?.length).toBe(1);
      expect(result.data?.tasks?.[0]).toEqual(mockTask);
    });

    it('should pass limit and lastId params', async () => {
      const mockResponse = {
        success: true,
        data: { tasks: [mockTask], hasMore: true },
        error: null,
      };

      const promise = service.getAll(10, 'task-0');

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/tasks?limit=10&lastId=task-0`
      );
      req.flush(mockResponse);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data?.hasMore).toBe(true);
    });
  });

  describe('create', () => {
    it('should create new task', async () => {
      const newTask = { title: 'New Task', description: 'New Description' };
      const mockResponse = {
        success: true,
        data: { ...mockTask, ...newTask },
        error: null,
      };

      const promise = service.create(newTask);

      const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks`);
      req.flush(mockResponse);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe('New Task');
      expect(result.data?.description).toBe('New Description');
    });
  });

  describe('update', () => {
    it('should update existing task', async () => {
      const updateData = { title: 'Updated Title' };
      const mockResponse = {
        success: true,
        data: { ...mockTask, ...updateData },
        error: null,
      };

      const promise = service.update('task-1', updateData);

      const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks/task-1`);
      req.flush(mockResponse);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe('Updated Title');
    });

    it('should toggle completed status', async () => {
      const mockResponse = {
        success: true,
        data: { ...mockTask, completed: true },
        error: null,
      };

      const promise = service.update('task-1', { completed: true });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks/task-1`);
      req.flush(mockResponse);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data?.completed).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete task', async () => {
      const mockResponse = {
        success: true,
        data: null,
        error: null,
      };

      const promise = service.delete('task-1');

      const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks/task-1`);
      req.flush(mockResponse);

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });
});