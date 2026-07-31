INSERT INTO `content_items`
  (`id`, `kind`, `sort_order`, `title`, `eyebrow`, `body`, `media_url`, `media_alt`, `category`, `year`, `href`, `accent`, `created_at`, `updated_at`)
VALUES
  ('wedding-celebration', 'project', 15, 'Vows in Bloom', 'Wedding / Photography', 'A warm, candid wedding story balancing traditional portraits, joyful details and the unscripted moments between them.', '/images/wedding-celebration.jpg', 'Newlywed Indian couple smiling in traditional wedding attire', 'Wedding Photography', '2026', '#vows-in-bloom', 'rust', datetime('now'), datetime('now')),
  ('event-film', 'project', 17, 'The Evening Opens', 'Event / Film', 'A concise event film built from atmosphere, stage details and the energy of guests arriving for a memorable evening.', '/videos/event-film.mp4', 'Microphone and blue lights inside an event venue', 'Event Film', '2026', '#evening-opens', 'ink', datetime('now'), datetime('now')),
  ('event-photography', 'project', 25, 'Ideas Live', 'Corporate event / Photography', 'Professional event coverage shaped around speakers, audiences, branded details and the human energy that makes the room matter.', '/images/event-stage.jpg', 'Speaker addressing a large audience at a professional event', 'Event Photography', '2026', '#ideas-live', 'forest', datetime('now'), datetime('now')),
  ('wedding-film', 'project', 27, 'A Garden Promise', 'Wedding / Cinematic film', 'A cinematic wedding film following the anticipation, emotion and quiet gestures that turn one day into a lasting memory.', '/videos/wedding-film.mp4', 'Bride and groom meeting in a garden on their wedding day', 'Wedding Film', '2026', '#garden-promise', 'sage', datetime('now'), datetime('now')),
  ('collective', 'team', 50, 'A specialist photography and film team', 'Photography team', 'Property, event and wedding photographers, filmmakers, aerial operators and editors—assembled around every story.', '/images/filmmaker.jpg', 'Professional photographer and filmmaker', 'Creative Team', '', '#people', 'ink', datetime('now'), datetime('now'))
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
UPDATE `site_settings`
SET
  `value` = json_set(
    `value`,
    '$.tagline', 'Properties, events and weddings—photographed with feeling.',
    '$.description', 'Mindrythm is a professional photography and film studio for properties, resorts, events, weddings and brands. We create polished visual stories that make spaces desirable, celebrations unforgettable and every important moment worth returning to.',
    '$.vision', 'To give every space, celebration and milestone its own visual memory through considered light, honest emotion and precise composition.',
    '$.idea', 'Property photography, resort films, event coverage, wedding photography and cinematic films—planned as one coherent visual story for every brief.'
  ),
  `updated_at` = datetime('now')
WHERE `key` = 'site';
