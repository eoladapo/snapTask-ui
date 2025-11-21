import { describe, it, expect } from 'vitest';
import {
  getContrastRatio,
  checkContrast,
  verifyLandingPageContrast,
  tailwindColors,
  landingPageColorPairs,
} from '../colorContrastChecker';

describe('Color Contrast Checker', () => {
  describe('getContrastRatio', () => {
    it('should calculate correct contrast ratio for black on white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should calculate correct contrast ratio for white on black', () => {
      const ratio = getContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should calculate same ratio regardless of color order', () => {
      const ratio1 = getContrastRatio('#4f46e5', '#FFFFFF');
      const ratio2 = getContrastRatio('#FFFFFF', '#4f46e5');
      expect(ratio1).toBe(ratio2);
    });

    it('should return 1:1 for identical colors', () => {
      const ratio = getContrastRatio('#FFFFFF', '#FFFFFF');
      expect(ratio).toBe(1);
    });
  });

  describe('checkContrast', () => {
    it('should pass for high contrast combinations', () => {
      const result = checkContrast('#000000', '#FFFFFF', 4.5);
      expect(result.passes).toBe(true);
      expect(result.level).toBe('AAA');
    });

    it('should fail for low contrast combinations', () => {
      const result = checkContrast('#CCCCCC', '#FFFFFF', 4.5);
      expect(result.passes).toBe(false);
      expect(result.level).toBe('Fail');
    });

    it('should correctly identify AA level', () => {
      // Gray-600 on white should be around 7.5:1 (AA but not AAA for normal text)
      const result = checkContrast(tailwindColors.gray[600], tailwindColors.white, 4.5);
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Landing Page Color Verification', () => {
    it('should verify all landing page color combinations', () => {
      const { results, allPass } = verifyLandingPageContrast();
      
      expect(results).toHaveLength(landingPageColorPairs.length);
      expect(allPass).toBe(true);
    });

    it('should pass WCAG AA for main text on light backgrounds', () => {
      const result = checkContrast(
        tailwindColors.gray[900],
        tailwindColors.white,
        4.5
      );
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should pass WCAG AA for main text on dark backgrounds', () => {
      const result = checkContrast(
        tailwindColors.white,
        tailwindColors.gray[900],
        4.5
      );
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should pass WCAG AA for button text', () => {
      const indigoResult = checkContrast(
        tailwindColors.white,
        tailwindColors.indigo[600],
        4.5
      );
      const purpleResult = checkContrast(
        tailwindColors.white,
        tailwindColors.purple[600],
        4.5
      );
      
      expect(indigoResult.passes).toBe(true);
      expect(purpleResult.passes).toBe(true);
    });

    it('should pass WCAG AA for secondary text', () => {
      const lightModeResult = checkContrast(
        tailwindColors.gray[600],
        tailwindColors.white,
        4.5
      );
      const darkModeResult = checkContrast(
        tailwindColors.gray[300],
        tailwindColors.gray[900],
        4.5
      );
      
      expect(lightModeResult.passes).toBe(true);
      expect(darkModeResult.passes).toBe(true);
    });

    it('should pass 3:1 ratio for UI components', () => {
      const result = checkContrast(
        tailwindColors.green[500],
        tailwindColors.white,
        3.0
      );
      expect(result.passes).toBe(true);
      expect(result.ratio).toBeGreaterThanOrEqual(3.0);
    });

    it('should pass 3:1 ratio for focus indicators', () => {
      const lightResult = checkContrast(
        tailwindColors.indigo[500],
        tailwindColors.white,
        3.0
      );
      const darkResult = checkContrast(
        tailwindColors.indigo[500],
        tailwindColors.gray[900],
        3.0
      );
      
      expect(lightResult.passes).toBe(true);
      expect(darkResult.passes).toBe(true);
    });
  });

  describe('Specific Color Combinations', () => {
    it('should verify gray-900 on white (main headings)', () => {
      const ratio = getContrastRatio(tailwindColors.gray[900], tailwindColors.white);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(16.1, 0);
    });

    it('should verify gray-600 on white (secondary text)', () => {
      const ratio = getContrastRatio(tailwindColors.gray[600], tailwindColors.white);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(7.5, 0);
    });

    it('should verify white on indigo-600 (buttons)', () => {
      const ratio = getContrastRatio(tailwindColors.white, tailwindColors.indigo[600]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(8.3, 0);
    });

    it('should verify white on purple-600 (buttons)', () => {
      const ratio = getContrastRatio(tailwindColors.white, tailwindColors.purple[600]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(6.3, 0);
    });

    it('should verify gray-300 on gray-900 (dark mode text)', () => {
      const ratio = getContrastRatio(tailwindColors.gray[300], tailwindColors.gray[900]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(11.6, 0);
    });
  });
});
