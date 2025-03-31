CREATE TABLE `tb_user` (
    `id_user` BIGINT NOT NULL AUTO_INCREMENT,
    `id_type_user` BIGINT,
    `name` VARCHAR(35),
    `cpf_cnpj` VARCHAR(14),
    `identity` VARCHAR(14),
    `identity_expeditor` VARCHAR(14),
    `date_expeditor_identity` DATETIME,
    `gender` VARCHAR(14),
    `date_birth` DATETIME,
    `nationality` VARCHAR(30),
    `naturalness` VARCHAR(30),
    `cnh_number` VARCHAR(20),
    `username` VARCHAR(100),
    `password` VARCHAR(100),
    `observation` VARCHAR(1000),
    `flg_status` BIGINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_user)
);

CREATE TABLE `tb_company` (
    `id_company` BIGINT NOT NULL AUTO_INCREMENT,
    `name_company` VARCHAR(100),
    `name_fantasy` VARCHAR(100),
    `cnpj` VARCHAR(35),
    `municipal_registration` VARCHAR(150),
    `state_registration` VARCHAR(150),
    `address` VARCHAR(100),
    `date_foundation` DATETIME,
    `mail` VARCHAR(100),
    `tel_contact` VARCHAR(20),
    `flg_status` BIGINT,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_company)
);

CREATE TABLE `tb_user_company` (
    `id_user_company` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT NOT NULL,
    `id_company` BIGINT NOT NULL,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT NOT NULL,
    `dt_update` DATETIME,
    PRIMARY KEY (id_user_company)
    CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES tb_user(id_user),
    CONSTRAINT fk_company FOREIGN KEY (id_company) REFERENCES tb_company(id_company)
);

CREATE TABLE `tb_user_contact` (
    `id_user_contact` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT,
    `tel_contact` VARCHAR(20),
    `cell_contact` VARCHAR(20),
    `mail` VARCHAR(100),
    `flg_status` BIGINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_user_contact)
    CONSTRAINT fk_user_contact FOREIGN KEY (id_user) REFERENCES tb_user(id_user)

);

CREATE TABLE `tb_user_address` (
    `tb_user_address` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT,
    `type_address` VARCHAR(50),
    `type_place` VARCHAR(35),
    `street` VARCHAR(14),
    `place` VARCHAR(35),
    `number` VARCHAR(10),,
    `complement` VARCHAR(14),
    `district` VARCHAR(25),
    `city` VARCHAR(35),
    `state` VARCHAR(35),
    `flg_status` BIGINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_user)
    CONSTRAINT fk_user_address FOREIGN KEY (id_user) REFERENCES tb_user(id_user)

);

CREATE TABLE `tb_vehicle` (
    `id_vehicle` BIGINT NOT NULL AUTO_INCREMENT,
    `plate` VARCHAR(14),
    `chassi` VARCHAR(50),
    `renavam` VARCHAR(100),
    `brand` VARCHAR(100),
    `code_fipe` VARCHAR(14),
    `year_manufacture` DATETIME,
    `year_model` DATETIME,
    `fuel` VARCHAR(14),
    `vehicle_value` DECIMAL,
    `passenger_number` BIGINT,
    `doors_number` BIGINT,
    `category` VARCHAR(20),
    `color` VARCHAR(20),
    `exchange` VARCHAR(15),
    `flg_status` BIGINT,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_vehicle)
);

CREATE TABLE `tb_user_vehicle` (
    `id_user_vehicle` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT,
    `id_vehicle` BIGINT,
    `flg_status` BIGINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` ,
    `dt_update` DATETIME,
    PRIMARY KEY (id_vehicle_inspection)
    CONSTRAINT fk_user_vehicle FOREIGN KEY (id_user) REFERENCES tb_user(id_user),
    CONSTRAINT fk_vehicle_vehicle FOREIGN KEY (id_vehicle) REFERENCES tb_vehicle(id_vehicle)
);


CREATE TABLE `tb_type_user` (
    `id_type_user` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50),
    `observation` VARCHAR(100),
    `flg_status` SMALLINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `id_insert_update` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `dt_update` DATETIME,
    PRIMARY KEY (id_type_user)
);


CREATE TABLE `tb_cost` (
    `id_cost` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT,
    `id_type_cost` BIGINT,
    `description` VARCHAR(100),
    `value` DECIMAL,
    `flg_status` SMALLINT DEFAULT 1,
    `id_login_insert` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_login_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_cost),
    CONSTRAINT fk_user_cost FOREIGN KEY (id_user) REFERENCES tb_user(id_user)
);



CREATE TABLE `tb_type_order_classification` (
    `id_type_order_classification` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT,
    `classification ` VARCHAR(150),
    `flg_status` SMALLINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_type_order_classification)
);


CREATE TABLE `tb_type_order_category` (
    `id_type_order_category` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT,
    `category  ` VARCHAR(150),
    `flg_status` SMALLINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_type_order_category)
);


CREATE TABLE `tb_type_order_service` (
    `id_type_order_service` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT,
    `service` VARCHAR(150),
    `flg_status` SMALLINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_type_order_service)
);

CREATE TABLE `tb_type_order_place` (
    `id_type_order_place` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT,
    `place` VARCHAR(150),
    `flg_status` SMALLINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_type_order_place)
);



CREATE DEFINER=r2db@% PROCEDURE sp_Ins_Order(IN p_user_mechanic_id bigint, IN p_order_type_id bigint,
                                              IN p_description text, IN p_value_suggestion decimal, IN p_attempt int,
                                              IN p_status smallint, IN p_prevision_start date, IN p_completion_estimate date,
                                              IN p_validity_budget date, IN p_login_id bigint, IN p_vehicle_ids text)
BEGIN
    DECLARE v_order_id BIGINT;

    -- Inserir uma ordem de serviço na tb_order
    INSERT INTO tb_order (id_user, id_type_order, description, value_suggestion, attempt, flg_status, prevision_start, completion_estimate, validity_budget, dt_insert, dt_update, id_login_insert, id_login_update)
    VALUES (p_user_mechanic_id, p_order_type_id, p_description, p_value_suggestion, p_attempt, 1, p_prevision_start, p_completion_estimate, p_validity_budget, NOW(), NOW(), p_login_id, p_login_id);

    -- Recuperar o id_order gerado pelo INSERT anterior
    SET v_order_id = LAST_INSERT_ID();

    -- Inserir registros na tb_order_vehicle para cada veículo relacionado à ordem de serviço
	INSERT INTO tb_order_vehicle (id_order, id_vehicle, flg_status, dt_insert, dt_update, id_insert_login, id_login_update)
	SELECT v_order_id, v.id_vehicle, p_status, NOW(), NOW(), p_login_id, p_login_id
	FROM tb_vehicle v
	WHERE FIND_IN_SET(v.id_vehicle, p_vehicle_ids);

END


CREATE TABLE `tb_user_driver` (
    `id_user_driver` BIGINT NOT NULL AUTO_INCREMENT,
    `id_user` BIGINT,
    `id_vehicle` BIGINT,
    `name` VARCHAR(150),
    `cpf_cnpj` VARCHAR(50),
    `cnh` VARCHAR(50),
    `registration` VARCHAR(50),
    `cell_contact` VARCHAR(35),
    `mail` VARCHAR(100),
    `flg_status` SMALLINT DEFAULT 1,
    `id_insert_login` BIGINT,
    `dt_insert` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `id_insert_update` BIGINT,
    `dt_update` DATETIME,
    PRIMARY KEY (id_user_driver),
    CONSTRAINT fk_user_driver FOREIGN KEY (id_user) REFERENCES tb_user(id_user),
    CONSTRAINT fk_vehicle_driver FOREIGN KEY (id_vehicle) REFERENCES tb_vehicle(id_vehicle)
);