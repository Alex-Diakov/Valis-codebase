import { useState, useCallback } from 'react';
import {
  ProductSurface,
  UxVersionMode,
  MemoryScope,
  EmployeeNavId,
  AdminNavId,
} from '../types/valis';

export function useValisWorkspace() {
  const [surface, setSurface] = useState<ProductSurface>('employee-app');
  const [uxMode, setUxMode] = useState<UxVersionMode>('v2-improvements');
  const [memoryScope, setMemoryScope] = useState<MemoryScope>('org-brain');
  const [employeeNav, setEmployeeNav] = useState<EmployeeNavId>('Home');
  const [adminNav, setAdminNav] = useState<AdminNavId>('Reports');

  const switchToAdminConsole = useCallback((initialNav: AdminNavId = 'Reports') => {
    setAdminNav(initialNav);
    setSurface('admin-console');
  }, []);

  const switchToEmployeeApp = useCallback((initialNav: EmployeeNavId = 'Home') => {
    setEmployeeNav(initialNav);
    setSurface('employee-app');
  }, []);

  const toggleUxMode = useCallback((mode: UxVersionMode) => {
    setUxMode(mode);
    if (mode === 'v1-baseline') {
      setMemoryScope('org-brain');
    }
  }, []);

  return {
    surface,
    setSurface,
    uxMode,
    setUxMode: toggleUxMode,
    memoryScope,
    setMemoryScope,
    employeeNav,
    setEmployeeNav,
    adminNav,
    setAdminNav,
    switchToAdminConsole,
    switchToEmployeeApp,
  };
}
