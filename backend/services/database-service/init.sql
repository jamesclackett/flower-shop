--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Postgres.app)
-- Dumped by pg_dump version 16.1

-- Started on 2024-03-27 15:38:19 GMT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16648)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16718)
-- Name: auth; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth (
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.auth OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16588)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_uuid uuid NOT NULL,
    created_at bigint DEFAULT EXTRACT(epoch FROM now()) NOT NULL
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16598)
-- Name: cart_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_item (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cart_uuid uuid NOT NULL,
    product_uuid uuid,
    quantity integer NOT NULL,
    created_at bigint DEFAULT EXTRACT(epoch FROM now()) NOT NULL
);


ALTER TABLE public.cart_item OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16578)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_name text NOT NULL,
    description text NOT NULL,
    price numeric NOT NULL,
    stock_remaining integer NOT NULL,
    img_src text NOT NULL,
    created_at bigint DEFAULT EXTRACT(epoch FROM now()) NOT NULL
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16577)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_id_seq OWNER TO postgres;

--
-- TOC entry 3675 (class 0 OID 0)
-- Dependencies: 218
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.uuid;


--
-- TOC entry 217 (class 1259 OID 16569)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    uuid uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    address_list text[] NOT NULL,
    created_at bigint DEFAULT EXTRACT(epoch FROM now()) NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16568)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 216
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".uuid;


--
-- TOC entry 3668 (class 0 OID 16718)
-- Dependencies: 222
-- Data for Name: auth; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth (username, password) FROM stdin;
\.


--
-- TOC entry 3666 (class 0 OID 16588)
-- Dependencies: 220
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (uuid, user_uuid, created_at) FROM stdin;
\.


--
-- TOC entry 3667 (class 0 OID 16598)
-- Dependencies: 221
-- Data for Name: cart_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_item (uuid, cart_uuid, product_uuid, quantity, created_at) FROM stdin;
\.


--
-- TOC entry 3665 (class 0 OID 16578)
-- Dependencies: 219
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (uuid, product_name, description, price, stock_remaining, img_src, created_at) FROM stdin;
2f463b2f-0f70-4555-b13c-47957289d82e	Bright Yellow Dahlia	Dahlia is a genus of bushy, tuberous, herbaceous perennial plants native to Mexico and Central America. As a member of the Asteraceae family of dicotyledonous plants, its relatives include the sunflower, daisy, chrysanthemum, and zinnia.	10.00	11	yellow.jpg	1710525215
f193dd04-3d4b-4e46-8df3-7d9d9c917734	Easter Lily	Lilium longiflorum, often called the Easter lily, is a species of plant endemic to both Taiwan and Ryukyu Islands. Lilium formosanum, a closely related species from Taiwan, has been treated as a variety of Easter lily in the past. It is a stem rooting lily, growing up to 1 m high.	13.99	5	lily.jpg	1710525225
92080675-9470-4b79-bc02-591aaa213f2f	Eden Rose 85	Rosa "Eden" is a light pink and white climbing rose. The cultivar was created by Marie-Louise Meilland and introduced in France by Meilland International in 1985 as part of the Renaissance® Collection.	32.00	19	red-rose.jpg	1710525235
381e3787-5847-4bea-98ee-9a8355c3ed13	Dancing Lady Orchid	Oncidium, abbreviated as Onc. in the horticultural trade, is a genus that, as of December 2023, contains about 340 species of orchids from the subtribe Oncidiinae of the orchid family Orchidaceae.	11.99	63	white-flowers.jpg	1710525245
737e28bd-b80b-4fc7-9a69-9a39472eb45d	Begonia	Begonia is a genus of perennial flowering plants in the family Begoniaceae. The genus contains more than 2,000 different plant species. The Begonias are native to moist subtropical and tropical climates.	19.00	25	pink-flowers.jpg	1710525255
\.


--
-- TOC entry 3663 (class 0 OID 16569)
-- Dependencies: 217
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (uuid, username, email, address_list, created_at) FROM stdin;
\.


--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 218
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_id_seq', 6, true);


--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 216
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 15, true);


--
-- TOC entry 3514 (class 2606 OID 16732)
-- Name: auth auth_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth
    ADD CONSTRAINT auth_pkey PRIMARY KEY (username);


--
-- TOC entry 3512 (class 2606 OID 16671)
-- Name: cart_item cart_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT cart_item_pkey PRIMARY KEY (uuid);


--
-- TOC entry 3508 (class 2606 OID 16665)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (uuid);


--
-- TOC entry 3506 (class 2606 OID 16681)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (uuid);


--
-- TOC entry 3502 (class 2606 OID 16693)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (uuid);


--
-- TOC entry 3510 (class 2606 OID 16717)
-- Name: cart user_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_uuid_unique UNIQUE (user_uuid);


--
-- TOC entry 3504 (class 2606 OID 16647)
-- Name: user username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT username_unique UNIQUE (username);


--
-- TOC entry 3516 (class 2606 OID 16704)
-- Name: cart_item cart_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT cart_fk FOREIGN KEY (cart_uuid) REFERENCES public.cart(uuid) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3517 (class 2606 OID 16709)
-- Name: cart_item product_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT product_fk FOREIGN KEY (product_uuid) REFERENCES public.product(uuid) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- TOC entry 3515 (class 2606 OID 16699)
-- Name: cart user_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_fk FOREIGN KEY (user_uuid) REFERENCES public."user"(uuid) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3518 (class 2606 OID 16733)
-- Name: auth username_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth
    ADD CONSTRAINT username_fk FOREIGN KEY (username) REFERENCES public."user"(username) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


-- Completed on 2024-03-27 15:38:19 GMT

--
-- PostgreSQL database dump complete
--

