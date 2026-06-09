export const CHART_COLORS = [
  "#002b54",
  "#1a5276",
  "#4a90d9",
  "#7ec8f4",
  "#b0d9f7",
  "#034078",
  "#1282a2",
];

export const CHART_TOOLTIP_STYLE = {
  borderRadius: 10,
  fontSize: 13,
  border: "1px solid #e8e8e8",
  fontFamily: "inherit",
};

export const AXIS_TICK_X = { fill: "#888", fontSize: 11, fontFamily: "inherit" };
export const AXIS_TICK_Y = { fill: "#888", fontSize: 10, fontFamily: "inherit" };

export const formatMillions = (v) => `$${(v / 1_000_000).toFixed(0)}M`;
export const formatMillionsDecimal = (v) => `$${(v / 1_000_000).toFixed(1)}M`;
export const formatThousands = (v) => `$${(v / 1_000).toFixed(0)}K`;
