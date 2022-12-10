create table  markets(
    market_id smallserial primary key,
    name text
);

create table unique_products(
  good_id serial primary key,
  name text,
  for_adults boolean,
  path text,
  brand text,
  img text,
  categories integer[]
);

create table category(
  category_id serial primary key,
  name text,
  path text
);


create table market_product(
  market_product_id serial primary key,
  market_id smallint,
  good_id integer,
  price real,
  price_unit text,
  price_compare float,
  compare_unit text,
  foreign key (market_id) references markets (market_id),
  foreign key (good_id) references unique_products (good_id)
);


create table users(
    user_id serial primary key,
    name text,
    email text,
    password text
);

create table unconfirmed_users(
    unconfirmed_user_id serial primary key,
    name text,
    email text,
    password text,
    code smallint
);

-- create table products_category(
--     products_category_id serial primary key,
--     good_id integer,
--     category_id integer,
--     foreign key (good_id) references unique_products(good_id),
--     foreign key (category_id) references category(category_id)
-- );
