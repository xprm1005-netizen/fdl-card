-- FDL CARD — 4 Card Templates Seed Data
-- Run this after schema.sql

INSERT INTO public.card_templates (name, slug, sort_order, config) VALUES

-- 1. Gold
('Gold', 'gold', 1, '{
  "width": 400,
  "height": 560,
  "background": {
    "type": "gradient",
    "colors": ["#1a1000", "#3d2b00", "#1a1000"],
    "direction": "vertical"
  },
  "border": {
    "color": "#FFD700",
    "width": 3,
    "glowColor": "rgba(255,215,0,0.4)",
    "glowBlur": 20
  },
  "playerPhoto": { "x": 60, "y": 100, "width": 280, "height": 290 },
  "overall": { "x": 28, "y": 22, "fontSize": 58, "fill": "#FFD700", "fontStyle": "bold" },
  "position": { "x": 28, "y": 90, "fontSize": 17, "fill": "#FFD700" },
  "playerName": { "x": 200, "y": 410, "fontSize": 28, "fill": "#FFFFFF", "align": "center", "width": 340 },
  "teamColorBar": { "y": 448, "height": 4 },
  "stats": {
    "y": 462,
    "rowHeight": 22,
    "labelFontSize": 10,
    "valueFontSize": 15,
    "labelColor": "#A0A0A0",
    "valueColor": "#FFD700",
    "keys": ["SHO","PAS","SPD","DRI","PHY"],
    "cols": 5,
    "paddingX": 20
  },
  "watermark": { "x": 200, "y": 548, "fontSize": 8, "fill": "rgba(255,255,255,0.15)", "align": "center" }
}'),

-- 2. TOTY
('TOTY', 'toty', 2, '{
  "width": 400,
  "height": 560,
  "background": {
    "type": "gradient",
    "colors": ["#00101a", "#003344", "#00101a"],
    "direction": "vertical"
  },
  "border": {
    "color": "#00E5FF",
    "width": 3,
    "glowColor": "rgba(0,229,255,0.4)",
    "glowBlur": 25
  },
  "playerPhoto": { "x": 60, "y": 100, "width": 280, "height": 290 },
  "overall": { "x": 28, "y": 22, "fontSize": 58, "fill": "#00E5FF", "fontStyle": "bold" },
  "position": { "x": 28, "y": 90, "fontSize": 17, "fill": "#00E5FF" },
  "playerName": { "x": 200, "y": 410, "fontSize": 28, "fill": "#FFFFFF", "align": "center", "width": 340 },
  "teamColorBar": { "y": 448, "height": 4 },
  "stats": {
    "y": 462,
    "rowHeight": 22,
    "labelFontSize": 10,
    "valueFontSize": 15,
    "labelColor": "#80D8FF",
    "valueColor": "#00E5FF",
    "keys": ["SHO","PAS","SPD","DRI","PHY"],
    "cols": 5,
    "paddingX": 20
  },
  "watermark": { "x": 200, "y": 548, "fontSize": 8, "fill": "rgba(255,255,255,0.15)", "align": "center" }
}'),

-- 3. Chrome
('Chrome', 'chrome', 3, '{
  "width": 400,
  "height": 560,
  "background": {
    "type": "gradient",
    "colors": ["#0d0d0d", "#1e2530", "#0d0d0d"],
    "direction": "vertical"
  },
  "border": {
    "color": "#B0C4DE",
    "width": 3,
    "glowColor": "rgba(176,196,222,0.3)",
    "glowBlur": 20
  },
  "playerPhoto": { "x": 60, "y": 100, "width": 280, "height": 290 },
  "overall": { "x": 28, "y": 22, "fontSize": 58, "fill": "#B0C4DE", "fontStyle": "bold" },
  "position": { "x": 28, "y": 90, "fontSize": 17, "fill": "#B0C4DE" },
  "playerName": { "x": 200, "y": 410, "fontSize": 28, "fill": "#E8EDF2", "align": "center", "width": 340 },
  "teamColorBar": { "y": 448, "height": 4 },
  "stats": {
    "y": 462,
    "rowHeight": 22,
    "labelFontSize": 10,
    "valueFontSize": 15,
    "labelColor": "#8898AA",
    "valueColor": "#B0C4DE",
    "keys": ["SHO","PAS","SPD","DRI","PHY"],
    "cols": 5,
    "paddingX": 20
  },
  "watermark": { "x": 200, "y": 548, "fontSize": 8, "fill": "rgba(255,255,255,0.15)", "align": "center" }
}'),

-- 4. Legend
('Legend', 'legend', 4, '{
  "width": 400,
  "height": 560,
  "background": {
    "type": "gradient",
    "colors": ["#0f0015", "#2a003d", "#0f0015"],
    "direction": "vertical"
  },
  "border": {
    "color": "#E040FB",
    "width": 3,
    "glowColor": "rgba(224,64,251,0.45)",
    "glowBlur": 28
  },
  "playerPhoto": { "x": 60, "y": 100, "width": 280, "height": 290 },
  "overall": { "x": 28, "y": 22, "fontSize": 58, "fill": "#E040FB", "fontStyle": "bold" },
  "position": { "x": 28, "y": 90, "fontSize": 17, "fill": "#E040FB" },
  "playerName": { "x": 200, "y": 410, "fontSize": 28, "fill": "#FFFFFF", "align": "center", "width": 340 },
  "teamColorBar": { "y": 448, "height": 4 },
  "stats": {
    "y": 462,
    "rowHeight": 22,
    "labelFontSize": 10,
    "valueFontSize": 15,
    "labelColor": "#CE93D8",
    "valueColor": "#E040FB",
    "keys": ["SHO","PAS","SPD","DRI","PHY"],
    "cols": 5,
    "paddingX": 20
  },
  "watermark": { "x": 200, "y": 548, "fontSize": 8, "fill": "rgba(255,255,255,0.15)", "align": "center" }
}')

ON CONFLICT (slug) DO UPDATE SET
  config = EXCLUDED.config,
  sort_order = EXCLUDED.sort_order;
