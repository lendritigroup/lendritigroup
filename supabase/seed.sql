-- Seed data for Lendriti Group Marketplace

-- Categories
INSERT INTO categories (id, slug, name_sq, name_en, name_de, name_sr, name_mk) VALUES
  ('11111111-1111-1111-1111-111111111101', 'kamionetat', 'Kamionetat', 'Trucks', 'LKW', 'Камиони', 'Камиони'),
  ('11111111-1111-1111-1111-111111111102', 'bagerat', 'Bagerat', 'Excavators', 'Bagger', 'Багери', 'Багери'),
  ('11111111-1111-1111-1111-111111111103', 'pjes-kembimi', 'Pjesë këmbimi', 'Spare Parts', 'Ersatzteile', 'Резервни делови', 'Резервни делови'),
  ('11111111-1111-1111-1111-111111111104', 'pajisje', 'Pajisje/Attachments', 'Equipment/Attachments', 'Anbaugeräte', 'Опрема/Прикључци', 'Опрема/Приклучоци'),
  ('11111111-1111-1111-1111-111111111105', 'sherbime', 'Shërbime', 'Services', 'Dienstleistungen', 'Услуге', 'Услуги')
ON CONFLICT DO NOTHING;

-- Products (8 sample products)
INSERT INTO products (id, slug, category_id, vehicle_type, title_sq, title_en, title_de, title_sr, title_mk, description_sq, description_en, year, brand, model, price, status, condition, location, hours, km) VALUES
  ('22222222-2222-2222-2222-222222222201', 'scania-r500-2020', '11111111-1111-1111-1111-111111111101', 'TRUCK', 'Scania R500 2020', 'Scania R500 2020', 'Scania R500 2020', 'Scania R500 2020', 'Scania R500 2020', 'Kamion i shkëlqyer në gjendje të mirë. Mirëmbajtje e rregullt.', 'Excellent truck in good condition. Regular maintenance.', 2020, 'Scania', 'R500', 85000, 'AVAILABLE', 'used', 'Tiranë', NULL, 450000),
  ('22222222-2222-2222-2222-222222222202', 'volvo-fh16-2019', '11111111-1111-1111-1111-111111111101', 'TRUCK', 'Volvo FH16 2019', 'Volvo FH16 2019', 'Volvo FH16 2019', 'Volvo FH16 2019', 'Volvo FH16 2019', 'Volvo FH16 me motor të fuqishëm. Gati për punë.', 'Volvo FH16 with powerful engine. Ready for work.', 2019, 'Volvo', 'FH16', 92000, 'AVAILABLE', 'used', 'Durrës', NULL, 380000),
  ('22222222-2222-2222-2222-222222222203', 'caterpillar-320e-2021', '11111111-1111-1111-1111-111111111102', 'EXCAVATOR', 'Caterpillar 320E 2021', 'Caterpillar 320E 2021', 'Caterpillar 320E 2021', 'Caterpillar 320E 2021', 'Caterpillar 320E 2021', 'Bager i ri Caterpillar 320E. Pak orë pune.', 'New Caterpillar 320E excavator. Low hours.', 2021, 'Caterpillar', '320E', 125000, 'AVAILABLE', 'used', 'Shkodër', 2500, NULL),
  ('22222222-2222-2222-2222-222222222204', 'hitachi-zx210-2018', '11111111-1111-1111-1111-111111111102', 'EXCAVATOR', 'Hitachi ZX210 2018', 'Hitachi ZX210 2018', 'Hitachi ZX210 2018', 'Hitachi ZX210 2018', 'Hitachi ZX210 2018', 'Hitachi ZX210 në gjendje të shkëlqyer.', 'Hitachi ZX210 in excellent condition.', 2018, 'Hitachi', 'ZX210', 78000, 'SOLD', 'used', 'Vlorë', 5200, NULL),
  ('22222222-2222-2222-2222-222222222205', 'komatsu-pc200-2022', '11111111-1111-1111-1111-111111111102', 'EXCAVATOR', 'Komatsu PC200 2022', 'Komatsu PC200 2022', 'Komatsu PC200 2022', 'Komatsu PC200 2022', 'Komatsu PC200 2022', 'Komatsu PC200 i ri, garanci plotësuese.', 'New Komatsu PC200, full warranty.', 2022, 'Komatsu', 'PC200', 145000, 'AVAILABLE', 'new', 'Tiranë', 150, NULL),
  ('22222222-2222-2222-2222-222222222206', 'man-tgx-2020', '11111111-1111-1111-1111-111111111101', 'TRUCK', 'MAN TGX 2020', 'MAN TGX 2020', 'MAN TGX 2020', 'MAN TGX 2020', 'MAN TGX 2020', 'MAN TGX në gjendje të mirë. Kohë e fundit servisuar.', 'MAN TGX in good condition. Recently serviced.', 2020, 'MAN', 'TGX', 72000, 'AVAILABLE', 'used', 'Elbasan', NULL, 320000),
  ('22222222-2222-2222-2222-222222222207', 'mercedes-actros-2021', '11111111-1111-1111-1111-111111111101', 'TRUCK', 'Mercedes Actros 2021', 'Mercedes Actros 2021', 'Mercedes Actros 2021', 'Mercedes Actros 2021', 'Mercedes Actros 2021', 'Mercedes Actros i ri. Pak kilometra.', 'New Mercedes Actros. Low mileage.', 2021, 'Mercedes', 'Actros', 95000, 'AVAILABLE', 'used', 'Tiranë', NULL, 180000),
  ('22222222-2222-2222-2222-222222222208', 'liebherr-r914-2019', '11111111-1111-1111-1111-111111111102', 'EXCAVATOR', 'Liebherr R914 2019', 'Liebherr R914 2019', 'Liebherr R914 2019', 'Liebherr R914 2019', 'Liebherr R914 2019', 'Liebherr R914 bager i madh për punë të rënda.', 'Liebherr R914 large excavator for heavy work.', 2019, 'Liebherr', 'R914', 135000, 'AVAILABLE', 'used', 'Durrës', 4100, NULL)
ON CONFLICT DO NOTHING;

-- Product photos (Unsplash - trucks and excavators)
INSERT INTO product_photos (product_id, url, order_index, is_main) VALUES
  ('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80', 0, true),
  ('22222222-2222-2222-2222-222222222202', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 0, true),
  ('22222222-2222-2222-2222-222222222203', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', 0, true),
  ('22222222-2222-2222-2222-222222222204', 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80', 0, true),
  ('22222222-2222-2222-2222-222222222205', 'https://images.unsplash.com/photo-1600185365926-7a457e4c9b0b?w=800&q=80', 0, true),
  ('22222222-2222-2222-2222-222222222206', 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&q=80', 0, true),
  ('22222222-2222-2222-2222-222222222207', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80', 0, true),
  ('22222222-2222-2222-2222-222222222208', 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&q=80', 0, true);

-- About page content
INSERT INTO pages (key, content_sq, content_en, content_de, content_sr, content_mk) VALUES
  ('about', 
   '<h2>Rreth Lendriti Group</h2><p>Lendriti Group SHPK është një kompani e specializuar në shitjen e automjeteve dhe pajisjeve të rënda. Me vite përvojë në tregun shqiptar dhe rajonal, ne ofrojmë zgjidhje të besueshme për klientët tanë.</p><h3>Shërbimet tona</h3><ul><li>Shitje e kamionëve dhe bagerëve</li><li>Pjesë këmbimi origjinale</li><li>Shërbime të specializuara</li></ul><h3>Misioni ynë</h3><p>Të jemi partneri më i besueshëm në tregun e automjeteve të rënda.</p><h3>Pse të na zgjidhni</h3><ul><li>Përvojë e gjatë në industri</li><li>Produkte të verifikuara</li><li>Përgjigje e shpejtë</li><li>Çmime konkurruese</li></ul>',
   '<h2>About Lendriti Group</h2><p>Lendriti Group SHPK is a company specialized in selling heavy vehicles and equipment. With years of experience in the Albanian and regional market, we offer reliable solutions for our clients.</p><h3>Our services</h3><ul><li>Sale of trucks and excavators</li><li>Original spare parts</li><li>Specialized services</li></ul><h3>Our mission</h3><p>To be the most trusted partner in the heavy vehicle market.</p><h3>Why choose us</h3><ul><li>Long experience in the industry</li><li>Verified products</li><li>Fast response</li><li>Competitive prices</li></ul>',
   '<h2>Über Lendriti Group</h2><p>Lendriti Group SHPK ist ein auf den Verkauf von Nutzfahrzeugen und Baumaschinen spezialisiertes Unternehmen. Mit langjähriger Erfahrung am albanischen und regionalen Markt bieten wir zuverlässige Lösungen für unsere Kunden.</p><h3>Unsere Dienstleistungen</h3><ul><li>Verkauf von LKW und Baggern</li><li>Original-Ersatzteile</li><li>Spezialisierte Dienstleistungen</li></ul><h3>Unsere Mission</h3><p>Der vertrauenswürdigste Partner auf dem Nutzfahrzeugmarkt zu sein.</p><h3>Warum uns wählen</h3><ul><li>Langjährige Branchenerfahrung</li><li>Verifizierte Produkte</li><li>Schnelle Reaktion</li><li>Wettbewerbsfähige Preise</li></ul>',
   '<h2>О Lendriti Group</h2><p>Lendriti Group SHPK је компанија специјализована за продају тешких возила и опреме. Са годинама искуства на албанском и регионалном тржишту, нудимо поуздана решења за наше клијенте.</p><h3>Наше услуге</h3><ul><li>Продаја камиона и багера</li><li>Оригинални резервни делови</li><li>Специјализоване услуге</li></ul><h3>Наша мисија</h3><p>Да будемо најпоузданији партнер на тржишту тешких возила.</p><h3>Зашто изабрати нас</h3><ul><li>Дуго искуство у индустрији</li><li>Верификовани производи</li><li>Брз одговор</li><li>Конкурентне цене</li></ul>',
   '<h2>За Lendriti Group</h2><p>Lendriti Group SHPK е компанија специјализирана за продажба на тешки возила и опрема. Со години искуство на албанскиот и регионалниот пазар, нудиме сигурни решенија за нашите клиенти.</p><h3>Нашите услуги</h3><ul><li>Продажба на камиони и багери</li><li>Оригинални резервни делови</li><li>Специјализирани услуги</li></ul><h3>Нашата мисија</h3><p>Да бидеме најдоверлив партнер на пазарот на тешки возила.</p><h3>Зошто да нè изберете</h3><ul><li>Долго искуство во индустријата</li><li>Верифицирани производи</li><li>Брз одговор</li><li>Конкурентни цени</li></ul>')
ON CONFLICT (key) DO UPDATE SET 
  content_sq = EXCLUDED.content_sq,
  content_en = EXCLUDED.content_en,
  content_de = EXCLUDED.content_de,
  content_sr = EXCLUDED.content_sr,
  content_mk = EXCLUDED.content_mk,
  updated_at = NOW();
