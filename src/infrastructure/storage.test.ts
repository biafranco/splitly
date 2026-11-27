
import { beforeEach, describe, expect, it } from 'vitest';
import { createEmptyData, loadData, saveData } from './storage';
import { createGroup } from '../domain/services/group';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize empty data', () => {
    expect(loadData()).toEqual({
      groups: [],
      participants: [],
      expenses: [],
      splits: [],
      settlements: [],
    });
  });

  it('should persist application data', () => {
    const data = createEmptyData();

    data.groups.push(createGroup('Viagem'));

    saveData(data);

    expect(loadData()).toEqual(data);
  });

  it('should overwrite existing data', () => {
    const data = createEmptyData();

    data.groups.push(createGroup('Viagem'));

    saveData(data);
    saveData(createEmptyData());

    expect(loadData().groups).toHaveLength(0);
  });

  it('should create independent empty data objects', () => {
    const first = createEmptyData();
    const second = createEmptyData();

    first.groups.push(createGroup('Viagem'));

    expect(second.groups).toHaveLength(0);
  });
});
