-- FDL CARD — 5 Card Templates Seed Data (v3: new layout + decorations + premium)
-- Run this after schema.sql

INSERT INTO public.card_templates (name, slug, sort_order, is_premium, price, config) VALUES

-- 1. Gold (Free)
('Gold', 'gold', 1, false, 0, '{
  "width": 400,
  "height": 560,
  "background": {
    "type": "gradient",
    "colors": ["#140c00", "#3a2000", "#140c00"]
  },
  "border": {
    "color": "#FFD700",
    "width": 3,
    "glowColor": "rgba(255,215,0,0.42)",
    "glowBlur": 22
  },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#FFD700" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#FFD700" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#FFFFFF", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": {
    "paddingX": 20,
    "y": 456,
    "rowHeight": 24,
    "valueFontSize": 17,
    "valueColor": "#FFD700",
    "labelFontSize": 10,
    "labelColor": "#A08040",
    "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"],
    "cols": 6
  },
  "decorations": [
    { "type": "rect", "x": 210, "y": -60, "width": 320, "height": 150, "fill": "rgba(255,215,0,0.05)", "rotation": -32 },
    { "type": "circle", "x": 360, "y": 500, "radius": 80, "fill": "rgba(255,215,0,0.03)" }
  ]
}'),

-- 2. Chrome (Free)
('Chrome', 'chrome', 2, false, 0, '{
  "width": 400,
  "height": 560,
  "background": {
    "type": "gradient",
    "colors": ["#080c10", "#141e2a", "#0a1018"]
  },
  "border": {
    "color": "#B0C4DE",
    "width": 3,
    "glowColor": "rgba(176,196,222,0.3)",
    "glowBlur": 22
  },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#B0C4DE" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#B0C4DE" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#E8EDF2", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": {
    "paddingX": 20,
    "y": 456,
    "rowHeight": 24,
    "valueFontSize": 17,
    "valueColor": "#B0C4DE",
    "labelFontSize": 10,
    "labelColor": "#708090",
    "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"],
    "cols": 6
  },
  "decorations": [
    { "type": "rect", "x": 0, "y": 145, "width": 400, "height": 1, "fill": "rgba(176,196,222,0.06)" },
    { "type": "rect", "x": 0, "y": 225, "width": 400, "height": 1, "fill": "rgba(176,196,222,0.05)" },
    { "type": "rect", "x": 0, "y": 305, "width": 400, "height": 1, "fill": "rgba(176,196,222,0.06)" },
    { "type": "rect", "x": 0, "y": 385, "width": 400, "height": 1, "fill": "rgba(176,196,222,0.05)" }
  ]
}'),

-- 3. Legend (Free)
('Legend', 'legend', 3, false, 0, '{
  "width": 400,
  "height": 560,
  "background": {
    "type": "gradient",
    "colors": ["#0c0014", "#220038", "#0c0014"]
  },
  "border": {
    "color": "#E040FB",
    "width": 3,
    "glowColor": "rgba(224,64,251,0.48)",
    "glowBlur": 30
  },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#E040FB" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#E040FB" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#FFFFFF", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": {
    "paddingX": 20,
    "y": 456,
    "rowHeight": 24,
    "valueFontSize": 17,
    "valueColor": "#E040FB",
    "labelFontSize": 10,
    "labelColor": "#CE93D8",
    "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"],
    "cols": 6
  },
  "decorations": [
    { "type": "circle", "x": 50, "y": 480, "radius": 90, "fill": "rgba(224,64,251,0.04)" },
    { "type": "circle", "x": 360, "y": 460, "radius": 70, "fill": "rgba(224,64,251,0.04)" }
  ]
}'),

-- 4. Fire (Premium, 3,900원)
('Fire', 'fire', 4, true, 3900, '{
  "width": 400,
  "height": 560,
  "background": {
    "type": "gradient",
    "colors": ["#0d0000", "#3a0600", "#8a1800", "#200000"]
  },
  "border": {
    "color": "#FF4500",
    "width": 3,
    "glowColor": "rgba(255,69,0,0.6)",
    "glowBlur": 32
  },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#FF6B00" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#FF6B00" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#FFFFFF", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": {
    "paddingX": 20,
    "y": 456,
    "rowHeight": 24,
    "valueFontSize": 17,
    "valueColor": "#FF6B00",
    "labelFontSize": 10,
    "labelColor": "#FF9060",
    "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"],
    "cols": 6
  },
  "decorations": [
    { "type": "rect", "x": 140, "y": -40, "width": 320, "height": 180, "fill": "rgba(255,80,0,0.07)", "rotation": -35 },
    { "type": "rect", "x": 200, "y": -20, "width": 240, "height": 130, "fill": "rgba(255,120,0,0.05)", "rotation": -25 },
    { "type": "circle", "x": 200, "y": 295, "radius": 200, "fill": "rgba(255,60,0,0.04)" }
  ]
}'),

-- 5. Ice (Premium, 3,900원)
('Ice', 'ice', 5, true, 3900, '{
  "width": 400,
  "height": 560,
  "background": {
    "type": "gradient",
    "colors": ["#000d14", "#001830", "#003040", "#000d14"]
  },
  "border": {
    "color": "#00CFFF",
    "width": 3,
    "glowColor": "rgba(0,207,255,0.52)",
    "glowBlur": 32
  },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#00CFFF" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#00CFFF" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#E8F8FF", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": {
    "paddingX": 20,
    "y": 456,
    "rowHeight": 24,
    "valueFontSize": 17,
    "valueColor": "#00CFFF",
    "labelFontSize": 10,
    "labelColor": "#80E8FF",
    "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"],
    "cols": 6
  },
  "decorations": [
    { "type": "rect", "x": 0, "y": 130, "width": 400, "height": 2, "fill": "rgba(0,207,255,0.08)" },
    { "type": "rect", "x": 0, "y": 215, "width": 400, "height": 2, "fill": "rgba(0,207,255,0.06)" },
    { "type": "rect", "x": 0, "y": 300, "width": 400, "height": 2, "fill": "rgba(0,207,255,0.08)" },
    { "type": "rect", "x": 0, "y": 385, "width": 400, "height": 2, "fill": "rgba(0,207,255,0.06)" },
    { "type": "rect", "x": 310, "y": -30, "width": 110, "height": 90, "fill": "rgba(0,207,255,0.05)", "rotation": -48 }
  ]
}')

ON CONFLICT (slug) DO UPDATE SET
  config     = EXCLUDED.config,
  sort_order = EXCLUDED.sort_order,
  is_premium = EXCLUDED.is_premium,
  price      = EXCLUDED.price;

-- Remove legacy TOTY template if exists
DELETE FROM public.card_templates WHERE slug = 'toty';
