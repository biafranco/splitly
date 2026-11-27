
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useGroups } from './useGroups';
import { loadData } from '../../infrastructure/storage';

describe('useGroups', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize without groups', () => {
    const { result } = renderHook(() => useGroups());

    expect(result.current.groups).toEqual([]);
  });

  it('should create a group', () => {
    const { result } = renderHook(() => useGroups());

    act(() => {
      result.current.addGroup('Viagem', 'Férias');
    });

    expect(result.current.groups).toHaveLength(1);
    expect(result.current.groups[0].name).toBe('Viagem');
  });

  it('should persist created groups', () => {
    const { result } = renderHook(() => useGroups());

    act(() => {
      result.current.addGroup('Viagem');
    });

    expect(loadData().groups).toHaveLength(1);
  });

  it('should load previously created groups', () => {
    const { result, unmount } = renderHook(() => useGroups());

    act(() => {
      result.current.addGroup('Viagem');
    });

    unmount();

    const newHook = renderHook(() => useGroups());

    expect(newHook.result.current.groups).toHaveLength(1);
  });

  it('should update a group', () => {
    const { result } = renderHook(() => useGroups());

    act(() => {
      result.current.addGroup('Viagem');
    });

    const id = result.current.groups[0].id;

    act(() => {
      result.current.editGroup(id, {
        name: 'Apartamento',
      });
    });

    expect(result.current.groups[0].name).toBe('Apartamento');
    expect(loadData().groups[0].name).toBe('Apartamento');
  });

  it('should delete a group', () => {
    const { result } = renderHook(() => useGroups());

    act(() => {
      result.current.addGroup('Viagem');
    });

    const id = result.current.groups[0].id;

    act(() => {
      result.current.deleteGroup(id);
    });

    expect(result.current.groups).toHaveLength(0);
    expect(loadData().groups).toHaveLength(0);
  });

  it('should reject updates to nonexistent groups', () => {
    const { result } = renderHook(() => useGroups());

    expect(() =>
      result.current.editGroup('invalid-id', {
        name: 'Viagem',
      }),
    ).toThrow('Group not found');
  });

  it('should reject groups with invalid names', () => {
    const { result } = renderHook(() => useGroups());

    expect(() =>
      result.current.addGroup(' '),
    ).toThrow();
  });
});
