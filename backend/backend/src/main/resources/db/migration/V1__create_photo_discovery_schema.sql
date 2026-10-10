CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE images (
    id VARCHAR(64) NOT NULL,
    title VARCHAR(500) NOT NULL,
    photographer VARCHAR(200) NOT NULL,
    photographer_url VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    download_location VARCHAR(1000),
    width INT NOT NULL,
    height INT NOT NULL,
    CONSTRAINT pk_images PRIMARY KEY (id)
);

CREATE TABLE download_quotas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    downloads_in_cycle INT NOT NULL,
    locked_until TIMESTAMP(6),
    CONSTRAINT pk_download_quotas PRIMARY KEY (id),
    CONSTRAINT uk_download_quotas_user UNIQUE (user_id),
    CONSTRAINT ck_download_quotas_count CHECK (downloads_in_cycle BETWEEN 0 AND 3),
    CONSTRAINT fk_download_quotas_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE downloads (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    image_id VARCHAR(64) NOT NULL,
    downloaded_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT pk_downloads PRIMARY KEY (id),
    CONSTRAINT fk_downloads_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_downloads_image FOREIGN KEY (image_id) REFERENCES images (id)
);

CREATE INDEX idx_downloads_user_downloaded_at ON downloads (user_id, downloaded_at);

CREATE TABLE favourites (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    image_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT pk_favourites PRIMARY KEY (id),
    CONSTRAINT uk_favourites_user_image UNIQUE (user_id, image_id),
    CONSTRAINT fk_favourites_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_favourites_image FOREIGN KEY (image_id) REFERENCES images (id)
);
