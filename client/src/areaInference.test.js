import test from 'node:test';
import assert from 'node:assert/strict';
import { findBestAreaMatch } from './areaInference.js';

const areaCatalog = [
  { name: 'Knowledge Park II', city: 'Greater Noida', latitude: 28.4742, longitude: 77.4831 },
  { name: 'Pari Chowk', city: 'Greater Noida', latitude: 28.4652, longitude: 77.5088 },
  { name: 'Sector 18', city: 'Noida', latitude: 28.5708, longitude: 77.3219 },
  { name: 'Gaur City', city: 'Greater Noida', latitude: 28.6044, longitude: 77.4378 },
  { name: 'Dwarka', city: 'Delhi', latitude: 28.5921, longitude: 77.046 },
  { name: 'Saket', city: 'Delhi', latitude: 28.5244, longitude: 77.2066 }
];

test('matches dominant area names from OCR-like text', () => {
  const result = findBestAreaMatch('road blocked near Knowledge Park II sign under construction', areaCatalog);
  assert.equal(result.name, 'Knowledge Park II');
});

test('supports abbreviated area names with sector formats', () => {
  const result = findBestAreaMatch('traffic jam at sector 18 noida', areaCatalog);
  assert.equal(result.name, 'Sector 18');
});
