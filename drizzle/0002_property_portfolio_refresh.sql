INSERT INTO `content_items`
  (`id`, `kind`, `sort_order`, `title`, `eyebrow`, `body`, `media_url`, `media_alt`, `category`, `year`, `href`, `accent`, `created_at`, `updated_at`)
VALUES
  ('quiet-frequency', 'project', 10, 'Azure Retreat', 'Resort film / Poolside', 'A sunlit hospitality story designed to communicate calm, scale and the effortless rhythm of a destination stay.', '/videos/resort-pool.mp4', 'Luxury resort swimming pool in warm daylight', 'Resort Film', '2026', '#azure-retreat', 'forest', datetime('now'), datetime('now')),
  ('in-passing', 'project', 20, 'The Courtyard Suite', 'Hospitality / Interior film', 'A measured walkthrough that turns material, light and room flow into a quiet invitation to stay.', '/videos/hotel-room.mp4', 'Camera moving through a refined hotel room interior', 'Hospitality', '2026', '#courtyard-suite', 'sage', datetime('now'), datetime('now')),
  ('field-notes', 'project', 30, 'Casa Verde', 'Real estate / Exterior', 'Clean architectural photography balancing strong geometry, tropical light and the openness of modern living.', '/images/villa-pool.jpg', 'Modern white villa with a private swimming pool', 'Real Estate', '2026', '#casa-verde', 'ink', datetime('now'), datetime('now')),
  ('object-ritual', 'project', 40, 'Stillness Suite', 'Boutique resort / Room film', 'A concise moving portrait of a private suite, created for booking platforms, social campaigns and property launches.', '/videos/boutique-room.mp4', 'Bright boutique hotel suite opening toward a pool', 'Resort', '2026', '#stillness-suite', 'lime', datetime('now'), datetime('now')),
  ('cliff-house', 'project', 45, 'Woodland House', 'Architecture / Twilight', 'An exterior series built around warm interior light, natural context and the clarity of contemporary architecture.', '/images/modern-house.jpg', 'Contemporary residence photographed at blue hour', 'Architecture', '2026', '#woodland-house', 'forest', datetime('now'), datetime('now')),
  ('resort-at-dusk', 'project', 46, 'Horizon Resort', 'Hospitality / Blue hour', 'A twilight hospitality series balancing illuminated architecture, reflective water and the calm transition into evening.', '/images/resort-exterior.jpg', 'Resort pool and hotel exterior photographed at blue hour', 'Hospitality', '2026', '#horizon-resort', 'ink', datetime('now'), datetime('now')),
  ('tropical-pavilion', 'project', 47, 'Tropical Pavilion', 'Real estate / Lifestyle', 'A lifestyle-led property story connecting contemporary architecture with the relaxed way the home is meant to be lived in.', '/images/tropical-interior.jpg', 'Contemporary tropical residence with a warm timber facade', 'Real Estate', '2026', '#tropical-pavilion', 'forest', datetime('now'), datetime('now')),
  ('sanctuary-interiors', 'project', 48, 'Sanctuary Interiors', 'Interiors / Editorial', 'Natural, spacious interior photography that communicates finish, proportion and an immediate sense of home.', '/images/luxury-interior.jpg', 'Contemporary living room with warm timber details', 'Interiors', '2026', '#sanctuary-interiors', 'sage', datetime('now'), datetime('now')),
  ('collective', 'team', 50, 'A specialist property image team', 'Photography team', 'Architecture photography, hospitality film, aerial capture, styling and post-production—assembled for each property.', '/images/filmmaker.jpg', 'Professional property photographer', 'Photography Team', '', '#people', 'ink', datetime('now'), datetime('now'))
ON CONFLICT(`id`) DO UPDATE SET
  `kind` = excluded.`kind`,
  `sort_order` = excluded.`sort_order`,
  `title` = excluded.`title`,
  `eyebrow` = excluded.`eyebrow`,
  `body` = excluded.`body`,
  `media_url` = excluded.`media_url`,
  `media_alt` = excluded.`media_alt`,
  `category` = excluded.`category`,
  `year` = excluded.`year`,
  `href` = excluded.`href`,
  `accent` = excluded.`accent`,
  `updated_at` = excluded.`updated_at`;
--> statement-breakpoint
INSERT INTO `site_settings` (`key`, `value`, `updated_at`)
VALUES (
  'site',
  '{"siteName":"MINDRYTHM","tagline":"Architecture, hospitality and places—photographed with feeling.","description":"Mindrythm is a professional photography and film studio specialising in resorts, real estate, architecture and interiors. We create polished visual stories that help exceptional places feel desirable, memorable and ready to be discovered.","vision":"To reveal the character of every property through considered light, precise composition and imagery that invites people to imagine themselves there.","idea":"Photography, aerial film, interiors and hospitality storytelling—planned as one coherent visual system for every property.","contactEmail":"Admin@mindrythm.com","phonePrimary":"+91 90735 73878","phoneSecondary":"+91 62923 33492","address":"250, Bansdroni, Rifle Club Playground, Kolkata - 700070","instagram":"https://instagram.com/","vimeo":"https://vimeo.com/","linkedin":"https://linkedin.com/","facebook":"https://facebook.com/","youtube":"https://youtube.com/"}',
  datetime('now')
)
ON CONFLICT(`key`) DO UPDATE SET
  `value` = json_set(
    `site_settings`.`value`,
    '$.tagline', 'Architecture, hospitality and places—photographed with feeling.',
    '$.description', 'Mindrythm is a professional photography and film studio specialising in resorts, real estate, architecture and interiors. We create polished visual stories that help exceptional places feel desirable, memorable and ready to be discovered.',
    '$.vision', 'To reveal the character of every property through considered light, precise composition and imagery that invites people to imagine themselves there.',
    '$.idea', 'Photography, aerial film, interiors and hospitality storytelling—planned as one coherent visual system for every property.'
  ),
  `updated_at` = excluded.`updated_at`;
