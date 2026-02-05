import { type AnyHeader } from '../AutoneGrid.types';

/**
 * Distributes the width of the viewport across the visible leaf headers if total
 * width of visible headers is less than the viewport width.
 */
export const getDynamicColumnWidths = (
  visibleLeafHeaders: AnyHeader[],
  viewportWidth: number | null,
) => {
  const leafHeaderWidths = visibleLeafHeaders.map((header) => header.getSize());
  // no viewport measurement - default to pre-defined sizes
  if (viewportWidth === null) return leafHeaderWidths;

  const leafHeaderTotalWidth = leafHeaderWidths.reduce(
    (prev, curr) => prev + curr,
    0,
  );

  // total leaf header widths exceeding viewport width - use pre-defined sizes
  if (leafHeaderTotalWidth >= viewportWidth) return leafHeaderWidths;

  // total leaf header widths less than viewport, distribute widths based on their ratios
  const dynamicLeafHeaderWidths = leafHeaderWidths.map(
    (width) => (width / leafHeaderTotalWidth) * viewportWidth,
  );
  return dynamicLeafHeaderWidths;
};
