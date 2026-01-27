CREATE TABLE IF NOT EXISTS tbl_users(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	phone_no CHAR(11) UNIQUE DEFAULT NULL,
	email VARCHAR(80) UNIQUE,
	password_hash VARCHAR(70) NOT NULL,
	access_type SMALLINT DEFAULT 0,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_images(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	image_url TEXT NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_addresses(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	address_name VARCHAR(10) NOT NULL,
	address_details VARCHAR(510) NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_discounts(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	name VARCHAR(255) NOT NULL,
	code VARCHAR(10) NOT NULL,
	percent_off INTEGER CHECK (percent_off >= 1 AND percent_off <= 100) DEFAULT NULL,
	amount_off DECIMAL(6,2) DEFAULT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_users_details(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	users_id UUID UNIQUE NOT NULL,
	images_id UUID DEFAULT NULL,
	first_name VARCHAR(40) NOT NULL,
	last_name VARCHAR(40) NOT NULL,
	addresses_id UUID DEFAULT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (users_id) REFERENCES tbl_users(id),
	FOREIGN KEY (images_id) REFERENCES tbl_images(id),
	FOREIGN KEY (addresses_id) REFERENCES tbl_addresses(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_auth_providers(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	users_id UUID NOT NULL,
	provider VARCHAR(50) NOT NULL,
	provider_id VARCHAR(255) NOT NULL,
	callback_url TEXT NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (users_id) REFERENCES tbl_users(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_companies(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	name VARCHAR(355) UNIQUE NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_categories(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	name VARCHAR(355) UNIQUE NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_products(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	name VARCHAR(255) NOT NULL,
	companies_id UUID NOT NULL,
	categories_id UUID NOT NULL,
	rating SMALLINT CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
	images_id UUID DEFAULT NULL,
	price DECIMAL(6,2) NOT NULL,
	details TEXT NOT NULL,
	ingredients TEXT NOT NULL,
	instructions TEXT NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (images_id) REFERENCES tbl_images(id),
	FOREIGN KEY (companies_id) REFERENCES tbl_companies(id),
	FOREIGN KEY (categories_id) REFERENCES tbl_categories(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_products_variants(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	products_id UUID NOT NULL,
	color_code CHAR(6) NOT NULL,
	images_id UUID NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (products_id) REFERENCES tbl_products(id),
	FOREIGN KEY (images_id) REFERENCES tbl_images(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_products_variants_stocks(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	sku CHAR(8) UNIQUE NOT NULL,
	products_variants_id UUID NOT NULL,
	qty SMALLINT,
	price DECIMAL(6,2) NOT NULL,
	addresses_id UUID NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (products_variants_id) REFERENCES tbl_products_variants(id),
	FOREIGN KEY (addresses_id) REFERENCES tbl_addresses(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_tags(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	name VARCHAR(255) UNIQUE NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_products_tags_bridge(
	products_id UUID NOT NULL,
	tags_id UUID NOT NULL,
	PRIMARY KEY (products_id, tags_id),
	FOREIGN KEY (products_id) REFERENCES tbl_products(id),
	FOREIGN KEY (tags_id) REFERENCES tbl_tags(id)
);

CREATE TABLE IF NOT EXISTS tbl_orders(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	users_id UUID NOT NULL,
	cart_total DECIMAL(6,2) NOT NULL,
	order_status SMALLINT DEFAULT 0,
	discounts_id UUID DEFAULT NULL,
	comments TEXT DEFAULT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (users_id) REFERENCES tbl_users(id),
	FOREIGN KEY (discounts_id) REFERENCES tbl_discounts(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_orders_products_bridge(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	orders_id UUID NOT NULL,
	products_variants_id UUID NOT NULL,
	comments TEXT DEFAULT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (orders_id) REFERENCES tbl_orders(id),
	FOREIGN KEY (products_variants_id) REFERENCES tbl_products_variants(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_users_products_favourites(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	users_id UUID NOT NULL,
	products_id UUID UNIQUE NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (users_id) REFERENCES tbl_users(id),
	FOREIGN KEY (products_id) REFERENCES tbl_products(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_notificatons(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	title VARCHAR(60) NOT NULL,
	description VARCHAR(255) NOT NULL,
	sent_time TIMESTAMP DEFAULT NOW(),
	users_id UUID NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (users_id) REFERENCES tbl_users(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);


CREATE TABLE IF NOT EXISTS tbl_payments_providers(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	name VARCHAR(255) NOT NULL,
	callback_url TEXT NOT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_payments(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	orders_id UUID NOT NULL,
	amount DECIMAL(6,2) NOT NULL,
	payments_providers_id UUID NOT NULL,
	payment_method SMALLINT DEFAULT 0,
	payment_status SMALLINT DEFAULT 0,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (orders_id) REFERENCES tbl_orders(id),
	FOREIGN KEY (payments_providers_id) REFERENCES tbl_payments_providers(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);

CREATE TABLE IF NOT EXISTS tbl_shipments(
	id UUID PRIMARY KEY DEFAULT UUIDv7(),
	orders_id UUID NOT NULL,
	payments_id UUID NOT NULL,
	shipping_cost DECIMAL(6,2),
	shipments_status SMALLINT DEFAULT 0,
	comments TEXT DEFAULT NULL,
	created_by UUID DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_by UUID DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL,
	deleted_by UUID DEFAULT NULL,
	deleted_at TIMESTAMP DEFAULT NULL,
	status SMALLINT DEFAULT 0,
	FOREIGN KEY (orders_id) REFERENCES tbl_orders(id),
	FOREIGN KEY (payments_id) REFERENCES tbl_payments(id),
	FOREIGN KEY (created_by) REFERENCES tbl_users(id),
	FOREIGN KEY (updated_by) REFERENCES tbl_users(id),
	FOREIGN KEY (deleted_by) REFERENCES tbl_users(id)
);