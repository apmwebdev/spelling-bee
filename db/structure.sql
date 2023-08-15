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
-- Name: user_color_scheme; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_color_scheme AS ENUM (
    'auto',
    'dark',
    'light'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.answers (
    id bigint NOT NULL,
    puzzle_id bigint NOT NULL,
    word_text character varying NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.answers_id_seq OWNED BY public.answers.id;


--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: guesses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guesses (
    id bigint NOT NULL,
    user_puzzle_attempt_id bigint NOT NULL,
    text character varying(15),
    is_spoiled boolean,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: guesses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.guesses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: guesses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.guesses_id_seq OWNED BY public.guesses.id;


--
-- Name: nyt_puzzles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nyt_puzzles (
    id bigint NOT NULL,
    nyt_id integer,
    json_data jsonb,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: nyt_puzzles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nyt_puzzles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nyt_puzzles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nyt_puzzles_id_seq OWNED BY public.nyt_puzzles.id;


--
-- Name: puzzles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.puzzles (
    id bigint NOT NULL,
    date date,
    center_letter character varying(1),
    outer_letters character varying[],
    origin_type character varying,
    origin_id bigint,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: puzzles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.puzzles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: puzzles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.puzzles_id_seq OWNED BY public.puzzles.id;


--
-- Name: sb_solver_puzzles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sb_solver_puzzles (
    id bigint NOT NULL,
    sb_solver_id character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: sb_solver_puzzles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sb_solver_puzzles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sb_solver_puzzles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sb_solver_puzzles_id_seq OWNED BY public.sb_solver_puzzles.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: status_tracking_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.status_tracking_options (
    key character varying NOT NULL,
    title character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: user_prefs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_prefs (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    color_scheme public.user_color_scheme DEFAULT 'auto'::public.user_color_scheme NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: user_prefs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_prefs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_prefs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_prefs_id_seq OWNED BY public.user_prefs.id;


--
-- Name: user_puzzle_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_puzzle_attempts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    puzzle_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: user_puzzle_attempts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_puzzle_attempts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_puzzle_attempts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_puzzle_attempts_id_seq OWNED BY public.user_puzzle_attempts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp(6) without time zone,
    remember_created_at timestamp(6) without time zone,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    name character varying,
    username character varying NOT NULL,
    provider character varying DEFAULT 'email'::character varying NOT NULL,
    uid character varying DEFAULT ''::character varying NOT NULL,
    allow_password_change boolean DEFAULT true,
    tokens json,
    jti character varying NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: words; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.words (
    text character varying NOT NULL,
    frequency numeric,
    definitions character varying[],
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: answers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers ALTER COLUMN id SET DEFAULT nextval('public.answers_id_seq'::regclass);


--
-- Name: guesses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guesses ALTER COLUMN id SET DEFAULT nextval('public.guesses_id_seq'::regclass);


--
-- Name: nyt_puzzles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nyt_puzzles ALTER COLUMN id SET DEFAULT nextval('public.nyt_puzzles_id_seq'::regclass);


--
-- Name: puzzles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.puzzles ALTER COLUMN id SET DEFAULT nextval('public.puzzles_id_seq'::regclass);


--
-- Name: sb_solver_puzzles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sb_solver_puzzles ALTER COLUMN id SET DEFAULT nextval('public.sb_solver_puzzles_id_seq'::regclass);


--
-- Name: user_prefs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_prefs ALTER COLUMN id SET DEFAULT nextval('public.user_prefs_id_seq'::regclass);


--
-- Name: user_puzzle_attempts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_puzzle_attempts ALTER COLUMN id SET DEFAULT nextval('public.user_puzzle_attempts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: guesses guesses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guesses
    ADD CONSTRAINT guesses_pkey PRIMARY KEY (id);


--
-- Name: nyt_puzzles nyt_puzzles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nyt_puzzles
    ADD CONSTRAINT nyt_puzzles_pkey PRIMARY KEY (id);


--
-- Name: puzzles puzzles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.puzzles
    ADD CONSTRAINT puzzles_pkey PRIMARY KEY (id);


--
-- Name: sb_solver_puzzles sb_solver_puzzles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sb_solver_puzzles
    ADD CONSTRAINT sb_solver_puzzles_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: user_prefs user_prefs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_prefs
    ADD CONSTRAINT user_prefs_pkey PRIMARY KEY (id);


--
-- Name: user_puzzle_attempts user_puzzle_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_puzzle_attempts
    ADD CONSTRAINT user_puzzle_attempts_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_answers_on_puzzle_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_answers_on_puzzle_id ON public.answers USING btree (puzzle_id);


--
-- Name: index_answers_on_word_text; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_answers_on_word_text ON public.answers USING btree (word_text);


--
-- Name: index_guesses_on_user_puzzle_attempt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_guesses_on_user_puzzle_attempt_id ON public.guesses USING btree (user_puzzle_attempt_id);


--
-- Name: index_guesses_on_user_puzzle_attempt_id_and_text; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_guesses_on_user_puzzle_attempt_id_and_text ON public.guesses USING btree (user_puzzle_attempt_id, text);


--
-- Name: index_puzzles_on_origin; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_puzzles_on_origin ON public.puzzles USING btree (origin_type, origin_id);


--
-- Name: index_puzzles_on_outer_letters; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_puzzles_on_outer_letters ON public.puzzles USING gin (outer_letters);


--
-- Name: index_status_tracking_options_on_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_status_tracking_options_on_key ON public.status_tracking_options USING btree (key);


--
-- Name: index_user_prefs_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_user_prefs_on_user_id ON public.user_prefs USING btree (user_id);


--
-- Name: index_user_puzzle_attempts_on_puzzle_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_puzzle_attempts_on_puzzle_id ON public.user_puzzle_attempts USING btree (puzzle_id);


--
-- Name: index_user_puzzle_attempts_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_puzzle_attempts_on_user_id ON public.user_puzzle_attempts USING btree (user_id);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_email ON public.users USING btree (email);


--
-- Name: index_users_on_jti; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_jti ON public.users USING btree (jti);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON public.users USING btree (reset_password_token);


--
-- Name: index_users_on_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_username ON public.users USING btree (username);


--
-- Name: index_words_on_definitions; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_words_on_definitions ON public.words USING gin (definitions);


--
-- Name: index_words_on_text; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_words_on_text ON public.words USING btree (text);


--
-- Name: user_prefs fk_rails_2b2e5eb793; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_prefs
    ADD CONSTRAINT fk_rails_2b2e5eb793 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: guesses fk_rails_4a9154fa82; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guesses
    ADD CONSTRAINT fk_rails_4a9154fa82 FOREIGN KEY (user_puzzle_attempt_id) REFERENCES public.user_puzzle_attempts(id);


--
-- Name: user_puzzle_attempts fk_rails_6b159d673b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_puzzle_attempts
    ADD CONSTRAINT fk_rails_6b159d673b FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id);


--
-- Name: answers fk_rails_c827d6894b; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT fk_rails_c827d6894b FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id);


--
-- Name: user_puzzle_attempts fk_rails_cac5f49fbc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_puzzle_attempts
    ADD CONSTRAINT fk_rails_cac5f49fbc FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: answers fk_rails_ddccab9dee; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT fk_rails_ddccab9dee FOREIGN KEY (word_text) REFERENCES public.words(text);


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20230606230237'),
('20230718021604'),
('20230718042515'),
('20230718061549'),
('20230718071300'),
('20230718072005'),
('20230718075800'),
('20230726033728'),
('20230726041156'),
('20230726041910'),
('20230726043150'),
('20230726045405'),
('20230803182425'),
('20230803205319'),
('20230804013313'),
('20230804013314'),
('20230808012355'),
('20230815032425');


