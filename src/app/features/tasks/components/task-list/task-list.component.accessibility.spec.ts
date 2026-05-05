import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../task.service';
import { AuthService } from '../../../../core/services/auth.service';
import { signal } from '@angular/core';

describe('TaskListComponent - Accesibilidad', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockTasks = [
    {
      id: 'task-1',
      title: 'Tarea pendiente',
      description: 'Descripción 1',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      userId: 'user-1',
    },
    {
      id: 'task-2',
      title: 'Tarea completada',
      description: 'Descripción 2',
      completed: true,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      userId: 'user-1',
    },
  ];

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', [
      'getAll',
      'create',
      'update',
      'delete',
    ]);
    mockTaskService.getAll.and.returnValue(
      Promise.resolve({
        success: true,
        data: { tasks: mockTasks, hasMore: false },
        error: null,
        meta: {},
      })
    );

    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    const userSignal = signal({ id: 'user-1', email: 'test@test.com', createdAt: '' });
    Object.defineProperty(mockAuthService, 'user', { get: () => userSignal, configurable: true });

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  describe('ARIA en Header y Navegación', () => {
    it('should have nav with aria-label', () => {
      fixture.detectChanges();
      const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
      expect(nav).toBeTruthy();
      expect(nav.getAttribute('aria-label')).toBe('Acciones de usuario');
    });

    it('should have logout button with aria-label', () => {
      fixture.detectChanges();
      const logoutBtn: HTMLButtonElement = fixture.nativeElement.querySelector('button[aria-label="Cerrar sesión"]');
      expect(logoutBtn).toBeTruthy();
    });

    it('should have add task button', () => {
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const addBtn = Array.from(buttons as NodeListOf<HTMLButtonElement>).find(b => b.textContent?.includes('Añadir Tarea'));
      expect(addBtn).toBeTruthy();
    });
  });

  describe('ARIA en Columnas', () => {
    it('should have main element', () => {
      fixture.detectChanges();
      const main: HTMLElement = fixture.nativeElement.querySelector('main');
      expect(main).toBeTruthy();
    });
  });

  describe('ARIA en Estados', () => {
    it('should have loading state with role="status"', async () => {
      component.loading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const status: HTMLElement = fixture.nativeElement.querySelector('[role="status"]');
      expect(status).toBeTruthy();
      expect(status.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('ARIA en Modales', () => {
    it('should have create task modal with role="dialog"', async () => {
      component.creatingTask.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
      expect(dialog.getAttribute('aria-modal')).toBe('true');
    });

    it('should have delete modal with role="dialog"', async () => {
      component.deletingTask.set(mockTasks[0] as any);
      fixture.detectChanges();
      await fixture.whenStable();

      const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
    });

    it('should have edit modal with role="dialog"', async () => {
      component.editingTask.set(mockTasks[0] as any);
      fixture.detectChanges();
      await fixture.whenStable();

      const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
    });

    it('should have edit title input with aria-required', async () => {
      component.editingTask.set(mockTasks[0] as any);
      fixture.detectChanges();
      await fixture.whenStable();

      const titleInput: HTMLInputElement = fixture.nativeElement.querySelector('#edit-title');
      expect(titleInput).toBeTruthy();
      expect(titleInput.getAttribute('aria-required')).toBe('true');
    });
  });

  describe('SVG Icons Accessibility', () => {
    it('should have all SVG icons with aria-hidden="true"', async () => {
      component.loading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const svgIcons: NodeListOf<SVGElement> = fixture.nativeElement.querySelectorAll('svg');
      svgIcons.forEach((svg) => {
        expect(svg.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });
});
