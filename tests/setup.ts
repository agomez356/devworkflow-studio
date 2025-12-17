/**
 * Test setup and utilities
 */

export const TEST_WORKSPACE = '/tmp/devworkflow-test';

export function setupTestWorkspace(): void {
  // Create test workspace
  // Clean up any existing test data
}

export function teardownTestWorkspace(): void {
  // Remove test workspace
}

export function mockExec(command: string): Promise<{ stdout: string; stderr: string }> {
  // Mock exec for testing
  return Promise.resolve({ stdout: '', stderr: '' });
}
