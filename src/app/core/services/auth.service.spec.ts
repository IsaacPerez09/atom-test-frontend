import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpService } from '../http/http.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  const mockAuthResponse = {
    user: mockUser,
    token: 'mock-token-123',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  describe('lookupUser', () => {
    it('should return user when exists', async () => {
      const expectedUrl = `${environment.apiUrl}/users/lookup?email=test%40example.com`;
      const promise = service.lookupUser('test@example.com');

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush({ success: true, data: mockAuthResponse, error: null });

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
      expect(result.data?.token).toBe('mock-token-123');
    });

    it('should return exists: false when user not found', async () => {
      const expectedUrl = `${environment.apiUrl}/users/lookup?email=notfound%40example.com`;
      const promise = service.lookupUser('notfound@example.com');

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush({ success: true, data: { user: null, token: undefined, exists: false }, error: null });

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data?.user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user and return token', async () => {
      const expectedUrl = `${environment.apiUrl}/users`;
      const promise = service.createUser('new@example.com');

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush({ success: true, data: mockAuthResponse, error: null });

      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.data?.user).toEqual(mockUser);
    });
  });

  describe('setUser', () => {
    it('should set user in signal and localStorage', () => {
      service.setUser(mockUser);

      expect(service.user()).toEqual(mockUser);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
    });

    it('should update user when called again', () => {
      const updatedUser = { ...mockUser, email: 'updated@example.com' };
      service.setUser(mockUser);
      service.setUser(updatedUser);

      expect(service.user()).toEqual(updatedUser);
    });
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      service.setToken('new-token-456');

      expect(localStorage.getItem('auth_token')).toBe('new-token-456');
    });
  });

  describe('logout', () => {
    it('should clear user signal and localStorage', () => {
      service.setUser(mockUser);
      service.setToken('mock-token');

      service.logout();

      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when user is set', () => {
      service.setUser(mockUser);

      expect(service.isAuthenticated()).toBe(true);
    });
  });
});