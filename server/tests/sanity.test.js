import { describe, it, expect } from 'vitest';

describe('Sanity Check', () => {
  it('should verify that true is true', () => {
    expect(true).toBe(true);
  });

  it('should perform basic math', () => {
    expect(1 + 1).toBe(2);
  });
});
