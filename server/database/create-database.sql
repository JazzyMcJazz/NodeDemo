CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    role varchar(10) DEFAULT 'user' NOT NULL,
    verified tinyint(1) DEFAULT 0 NOT NULL,
    enabled tinyint(1) DEFAULT 1 NOT NULL,
    created_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR (255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR (255) NOT NULL UNIQUE,
    description VARCHAR (255),
    price INT(11) NOT NULL,
    image_url VARCHAR (255),
    number_of_purchases INT(11) DEFAULT 0 NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category (id)
);

CREATE TABLE IF NOT EXISTS user_course (
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (course_id) REFERENCES course (id)
);

CREATE TABLE IF NOT EXISTS verification_token (
    user_id INTEGER PRIMARY KEY,
    token VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TRIGGER IF NOT EXISTS update_user_date
AFTER UPDATE ON user
    BEGIN
        UPDATE user
        SET updated_date = CURRENT_TIMESTAMP
        WHERE id = OLD.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_course_date
AFTER UPDATE ON course
    BEGIN
        UPDATE course
        SET updated_date = CURRENT_TIMESTAMP
        WHERE id = OLD.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_purchased AFTER INSERT ON user_course
    BEGIN
        UPDATE course
        SET number_of_purchases = number_of_purchases+1
        WHERE id = NEW.course_id;
    END;