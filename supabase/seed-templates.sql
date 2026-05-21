-- FDL CARD — Card Templates Seed Data
-- Run this after schema.sql

INSERT INTO public.card_templates (name, slug, sort_order, is_premium, price, config) VALUES

-- 1. Speed Star (Free)
('Speed Star', 'gold', 1, false, 0, '{
  "width": 400,
  "height": 560,
  "background": { "type": "gradient", "colors": ["#071008", "#12351E", "#071008"] },
  "border": { "color": "#62FF7E", "width": 3, "glowColor": "rgba(98,255,126,0.42)", "glowBlur": 22 },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#62FF7E" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#62FF7E" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#FFFFFF", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": { "paddingX": 20, "y": 456, "rowHeight": 24, "valueFontSize": 17, "valueColor": "#62FF7E", "labelFontSize": 10, "labelColor": "#31402D", "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"], "cols": 6 }
}'),

-- 2. Play Maker (Free)
('Play Maker', 'chrome', 2, false, 0, '{
  "width": 400,
  "height": 560,
  "background": { "type": "gradient", "colors": ["#080c10", "#20282D", "#0a1018"] },
  "border": { "color": "#DCE7EF", "width": 3, "glowColor": "rgba(220,231,239,0.3)", "glowBlur": 22 },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#DCE7EF" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#DCE7EF" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#E8EDF2", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": { "paddingX": 20, "y": 456, "rowHeight": 24, "valueFontSize": 17, "valueColor": "#DCE7EF", "labelFontSize": 10, "labelColor": "#708090", "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"], "cols": 6 }
}'),

-- 3. Team Leader (Free)
('Team Leader', 'legend', 3, false, 0, '{
  "width": 400,
  "height": 560,
  "background": { "type": "gradient", "colors": ["#0c0014", "#2A1435", "#0c0014"] },
  "border": { "color": "#C77DFF", "width": 3, "glowColor": "rgba(199,125,255,0.48)", "glowBlur": 30 },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#C77DFF" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#C77DFF" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#FFFFFF", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": { "paddingX": 20, "y": 456, "rowHeight": 24, "valueFontSize": 17, "valueColor": "#C77DFF", "labelFontSize": 10, "labelColor": "#CE93D8", "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"], "cols": 6 }
}'),

-- 4. Rising Pro (Premium)
('Rising Pro', 'rising', 4, true, 3900, '{
  "width": 400,
  "height": 560,
  "background": { "type": "gradient", "colors": ["#111407", "#2D3F08", "#111407"] },
  "border": { "color": "#BFFF35", "width": 3, "glowColor": "rgba(191,255,53,0.62)", "glowBlur": 34 },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#BFFF35" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#BFFF35" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#F8FFE9", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": { "paddingX": 20, "y": 456, "rowHeight": 24, "valueFontSize": 17, "valueColor": "#BFFF35", "labelFontSize": 10, "labelColor": "#CFEF7A", "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"], "cols": 6 }
}'),

-- 5. Match Day (Premium)
('Match Day', 'matchday', 5, true, 3900, '{
  "width": 400,
  "height": 560,
  "background": { "type": "gradient", "colors": ["#00110E", "#07372F", "#00110E"] },
  "border": { "color": "#31E6C5", "width": 3, "glowColor": "rgba(49,230,197,0.52)", "glowBlur": 32 },
  "overall": { "x": 20, "y": 14, "fontSize": 62, "fill": "#31E6C5" },
  "position": { "x": 20, "y": 80, "fontSize": 15, "fill": "#31E6C5" },
  "playerPhoto": { "x": 40, "y": 105, "width": 320, "height": 290 },
  "playerName": { "x": 200, "y": 398, "fontSize": 24, "fill": "#E8FFF9", "width": 340 },
  "teamColorBar": { "y": 436, "height": 9 },
  "stats": { "paddingX": 20, "y": 456, "rowHeight": 24, "valueFontSize": 17, "valueColor": "#31E6C5", "labelFontSize": 10, "labelColor": "#83F3DD", "keys": ["PAC","DRI","PHY","ACC","TAC","PSY"], "cols": 6 }
}')

ON CONFLICT (slug) DO UPDATE SET
  name       = EXCLUDED.name,
  config     = EXCLUDED.config,
  sort_order = EXCLUDED.sort_order,
  is_premium = EXCLUDED.is_premium,
  price      = EXCLUDED.price;

-- Remove legacy premium templates if they exist.
DELETE FROM public.card_templates WHERE slug IN ('toty', 'fire', 'ice');
