// Reusable identity-mass templates. Each template receives the same skeleton
// anchors so species and palette descriptors can swap hair without redrawing bodies.
export function drawHairTemplate(c, template, { cx, y, side, back, sgn }) {
  if (template === 'sweep') {
    if (back) {
      c.ellipse(cx, y + 12, 14, 13, 'lyraHair', 2);
      c.polygon([[cx - 13, y + 3], [cx - 5, y - 2], [cx + 10, y + 1], [cx + 14, y + 9], [cx + 8, y + 21], [cx - 12, y + 23]], 'lyraHair', 2);
      c.fillRect(cx - 6, y + 18, 12, 12, 'lyraHair', 1);
      c.fillRect(cx - 2, y + 4, 5, 14, 'lyraHair', 3);
    } else if (side) {
      c.ellipse(cx - sgn * 2, y + 11, 11, 12, 'lyraHair', 2);
      c.polygon([[cx + sgn * 8, y + 1], [cx - sgn * 4, y - 2], [cx - sgn * 12, y + 4], [cx - sgn * 13, y + 14], [cx - sgn * 9, y + 22]], 'lyraHair', 3);
      c.fillRect(cx - sgn * 12, y + 10, 4, 18, 'lyraHair', 1);
      c.fillRect(cx + sgn * 2, y + 5, 6, 5, 'lyraHair', 2);
    } else {
      c.ellipse(cx - 1, y + 10, 14, 12, 'lyraHair', 2);
      c.polygon([[cx - 14, y + 5], [cx - 5, y - 2], [cx + 11, y], [cx + 15, y + 7], [cx + 5, y + 10], [cx - 3, y + 7]], 'lyraHair', 3);
      c.fillRect(cx - 15, y + 7, 5, 18, 'lyraHair', 1);
      c.fillRect(cx - 13, y + 20, 4, 8, 'lyraHair', 2);
      c.fillRect(cx + 7, y + 7, 4, 7, 'lyraHair', 3);
    }
    return;
  }
  if (template === 'spikes') {
    c.polygon([[cx - 14, y + 13], [cx - 10, y - 2], [cx - 4, y + 4], [cx + 1, y - 5], [cx + 6, y + 3], [cx + 14, y - 1], [cx + 12, y + 18], [cx - 10, y + 22]], 'lyraHair', 2);
    return;
  }
  if (template === 'twin-tail') {
    c.ellipse(cx, y + 9, 10, 10, 'lyraHair', 2);
    c.polygon([[cx - 8, y + 6], [cx - 16, y + 2], [cx - 13, y + 18], [cx - 8, y + 23]], 'lyraHair', 1);
    c.polygon([[cx + 8, y + 6], [cx + 16, y + 2], [cx + 13, y + 18], [cx + 8, y + 23]], 'lyraHair', 1);
  }
}
