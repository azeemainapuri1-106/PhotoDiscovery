ALTER TABLE images ADD COLUMN source VARCHAR(32) DEFAULT 'UNSPLASH' NOT NULL;

ALTER TABLE images ADD COLUMN external_id VARCHAR(64);

UPDATE images SET external_id = id;

ALTER TABLE images MODIFY external_id VARCHAR(64) NOT NULL;

ALTER TABLE images
    ADD CONSTRAINT uk_images_source_external_id UNIQUE (source, external_id);

ALTER TABLE users
    ADD COLUMN auth_provider VARCHAR(16) DEFAULT 'LOCAL' NOT NULL;
