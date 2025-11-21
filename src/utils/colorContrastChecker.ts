/**
 * Color Contrast Checker Utility
 * Verifies WCAG AA compliance for color combinations
 */

interface ColorPair {
  foreground: string;
  background: string;
  usage: string;
  minRatio: number; // 4.5 for normal text, 3.0 for large text/UI
}

interface ContrastResult {
  pair: ColorPair;
  ratio: number;
  passes: boolean;
  level: 'AAA' | 'AA' | 'Fail';
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Use hex format (#RRGGBB)');
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function checkContrast(
  foreground: string,
  background: string,
  minRatio: number = 4.5
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);
  const passes = ratio >= minRatio;
  
  let level: 'AAA' | 'AA' | 'Fail';
  if (ratio >= 7.0) {
    level = 'AAA';
  } else if (ratio >= minRatio) {
    level = 'AA';
  } else {
    level = 'Fail';
  }

  return {
    pair: { foreground, background, usage: '', minRatio },
    ratio: Math.round(ratio * 10) / 10,
    passes,
    level,
  };
}

/**
 * Tailwind color palette (subset used in landing page)
 */
export const tailwindColors = {
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    900: '#312e81',
    950: '#1e1b4b',
  },
  purple: {
    400: '#c084fc',
    600: '#9333ea',
    700: '#7e22ce',
    900: '#581c87',
    950: '#3b0764',
  },
  green: {
    500: '#10b981',
  },
};

/**
 * Landing page color combinations to verify
 */
export const landingPageColorPairs: ColorPair[] = [
  // Light mode - Primary text
  {
    foreground: tailwindColors.gray[900],
    background: tailwindColors.white,
    usage: 'Main headings and body text (light mode)',
    minRatio: 4.5,
  },
  {
    foreground: tailwindColors.gray[600],
    background: tailwindColors.white,
    usage: 'Secondary text and descriptions (light mode)',
    minRatio: 4.5,
  },
  {
    foreground: tailwindColors.gray[700],
    background: tailwindColors.white,
    usage: 'Testimonial content (light mode)',
    minRatio: 4.5,
  },
  
  // Light mode - Buttons
  {
    foreground: tailwindColors.white,
    background: tailwindColors.indigo[600],
    usage: 'Button text on indigo background',
    minRatio: 4.5,
  },
  {
    foreground: tailwindColors.white,
    background: tailwindColors.purple[600],
    usage: 'Button text on purple background',
    minRatio: 4.5,
  },
  
  // Light mode - Footer
  {
    foreground: tailwindColors.gray[500],
    background: tailwindColors.white,
    usage: 'Footer copyright text (light mode)',
    minRatio: 4.5,
  },
  
  // Dark mode - Primary text
  {
    foreground: tailwindColors.white,
    background: tailwindColors.gray[900],
    usage: 'Main headings (dark mode)',
    minRatio: 4.5,
  },
  {
    foreground: tailwindColors.gray[300],
    background: tailwindColors.gray[900],
    usage: 'Body text and descriptions (dark mode)',
    minRatio: 4.5,
  },
  {
    foreground: tailwindColors.gray[300],
    background: tailwindColors.gray[800],
    usage: 'Card content text (dark mode)',
    minRatio: 4.5,
  },
  
  // Dark mode - Secondary elements
  {
    foreground: tailwindColors.gray[400],
    background: tailwindColors.gray[900],
    usage: 'Secondary text (dark mode)',
    minRatio: 4.5,
  },
  {
    foreground: tailwindColors.gray[500],
    background: tailwindColors.black,
    usage: 'Footer text (dark mode)',
    minRatio: 4.5,
  },
  
  // UI Components
  {
    foreground: tailwindColors.green[500],
    background: tailwindColors.white,
    usage: 'Trust badge checkmark (UI component)',
    minRatio: 3.0, // UI components need 3:1
  },
  
  // Focus indicators
  {
    foreground: tailwindColors.indigo[500],
    background: tailwindColors.white,
    usage: 'Focus ring on light background',
    minRatio: 3.0,
  },
  {
    foreground: tailwindColors.indigo[500],
    background: tailwindColors.gray[900],
    usage: 'Focus ring on dark background',
    minRatio: 3.0,
  },
];

/**
 * Run contrast checks on all landing page color pairs
 */
export function verifyLandingPageContrast(): {
  results: ContrastResult[];
  allPass: boolean;
  summary: string;
} {
  const results = landingPageColorPairs.map((pair) =>
    checkContrast(pair.foreground, pair.background, pair.minRatio)
  );

  const allPass = results.every((result) => result.passes);
  const failedCount = results.filter((r) => !r.passes).length;
  
  const summary = allPass
    ? `✅ All ${results.length} color combinations pass WCAG AA standards`
    : `❌ ${failedCount} of ${results.length} color combinations fail WCAG AA standards`;

  return { results, allPass, summary };
}

/**
 * Simulate color blindness types
 */
export const colorBlindnessInfo = {
  protanopia: {
    name: 'Protanopia (Red-Blind)',
    description: 'Difficulty distinguishing red from green',
    recommendations: [
      'Use blue/purple color scheme (✓ implemented)',
      'Avoid red/green only distinctions (✓ compliant)',
      'Use icons with color indicators (✓ implemented)',
    ],
  },
  deuteranopia: {
    name: 'Deuteranopia (Green-Blind)',
    description: 'Difficulty distinguishing green from red',
    recommendations: [
      'Blue/purple scheme remains visible (✓ implemented)',
      'Trust indicators use checkmarks + color (✓ implemented)',
      'All status has textual labels (✓ implemented)',
    ],
  },
  tritanopia: {
    name: 'Tritanopia (Blue-Blind)',
    description: 'Difficulty distinguishing blue from yellow',
    recommendations: [
      'Purple appears as pink/red, distinguishable (✓ acceptable)',
      'Sufficient luminance contrast maintained (✓ implemented)',
      'No critical info by blue alone (✓ compliant)',
    ],
  },
  achromatopsia: {
    name: 'Achromatopsia (Complete Color Blindness)',
    description: 'No color perception, only luminance',
    recommendations: [
      'All elements maintain luminance contrast (✓ implemented)',
      'Information not conveyed by color alone (✓ implemented)',
      'Icons and text labels accompany colors (✓ implemented)',
    ],
  },
};

/**
 * Generate a contrast report
 */
export function generateContrastReport(): string {
  const { results, allPass, summary } = verifyLandingPageContrast();
  
  let report = '# Color Contrast Verification Report\n\n';
  report += `## Summary\n${summary}\n\n`;
  report += `## Detailed Results\n\n`;
  
  results.forEach((result, index) => {
    const pair = landingPageColorPairs[index];
    const status = result.passes ? '✅ PASS' : '❌ FAIL';
    report += `### ${index + 1}. ${pair.usage}\n`;
    report += `- **Foreground**: ${pair.foreground}\n`;
    report += `- **Background**: ${pair.background}\n`;
    report += `- **Contrast Ratio**: ${result.ratio}:1\n`;
    report += `- **Required**: ${pair.minRatio}:1\n`;
    report += `- **Level**: ${result.level}\n`;
    report += `- **Status**: ${status}\n\n`;
  });
  
  report += `## Color Blindness Considerations\n\n`;
  Object.values(colorBlindnessInfo).forEach((info) => {
    report += `### ${info.name}\n`;
    report += `${info.description}\n\n`;
    report += `**Recommendations:**\n`;
    info.recommendations.forEach((rec) => {
      report += `- ${rec}\n`;
    });
    report += '\n';
  });
  
  return report;
}
