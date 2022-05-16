CREATE OR REPLACE DATABASE epytodo;

USE epytodo;

CREATE OR REPLACE TABLE user (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        firstname VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_user PRIMARY KEY (id)
    );

CREATE OR REPLACE TABLE todo (
        id BIGINT NOT UNSIGNED NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT NOW(),
        due_time DATETIME NOT NULL,
        status VARCHAR(11) NOT NULL DEFAULT 'not started',
        user_id BIGINT UNSIGNED NOT NULL,
        CONSTRAINT pk_todo PRIMARY KEY (id),
        CONSTRAINT fk_todo_user FOREIGN KEY (user_id) REFERENCES user(id)
    );
