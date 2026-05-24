// Figma-asset imports for tool product images.
// Add new entries here when replacing tool images with Figma assets.
import grinderImg from 'figma:asset/efb9e1a62189555beb8fd857e8369c7aab388007.png';
import circularSawImg from 'figma:asset/f59093520509a0a8ce4901fb8c69282bb0ec1bee.png';
import rotaryHammerImg from 'figma:asset/6798adb6ef4bc246d41b26b2dca7257c9904815e.png';
import laserLevelImg from 'figma:asset/3d4edfe3cda7dee5260fd77822b320939c34ee1a.png';

export const TOOL_IMAGES: Record<string, string> = {
  t1: rotaryHammerImg,
  t2: circularSawImg,
  t3: grinderImg,
  t_scan: laserLevelImg,
};