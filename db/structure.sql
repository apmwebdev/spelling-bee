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
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: letter_panel_locations; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.letter_panel_locations AS ENUM (
    'start',
    'end'
);


--
-- Name: search_panel_locations; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.search_panel_locations AS ENUM (
    'start',
    'end',
    'anywhere'
);


--
-- Name: sort_order_options; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.sort_order_options AS ENUM (
    'asc',
    'desc'
);


--
-- Name: substring_hint_output_types; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.substring_hint_output_types AS ENUM (
    'word_length_grid',
    'word_count_list',
    'letters_list'
);


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
-- Name: default_hint_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.default_hint_profiles (
    id bigint NOT NULL,
    name character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: default_hint_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.default_hint_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: default_hint_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.default_hint_profiles_id_seq OWNED BY public.default_hint_profiles.id;


--
-- Name: definition_panels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.definition_panels (
    id bigint NOT NULL,
    hide_known boolean DEFAULT true NOT NULL,
    reveal_length boolean DEFAULT true NOT NULL,
    show_obscurity boolean DEFAULT false NOT NULL,
    sort_order public.sort_order_options DEFAULT 'asc'::public.sort_order_options NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    revealed_letters integer DEFAULT 1 NOT NULL,
    separate_known boolean DEFAULT true NOT NULL,
    CONSTRAINT positive_revealed_letters CHECK ((revealed_letters > 0))
);


--
-- Name: definition_panels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.definition_panels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: definition_panels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.definition_panels_id_seq OWNED BY public.definition_panels.id;


--
-- Name: guesses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.guesses (
    id bigint NOT NULL,
    user_puzzle_attempt_id bigint NOT NULL,
    text character varying(15),
    is_spoiled boolean,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    user_puzzle_attempt_uuid uuid NOT NULL
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
-- Name: hint_panels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hint_panels (
    id bigint NOT NULL,
    name character varying,
    hint_profile_type character varying NOT NULL,
    hint_profile_id bigint NOT NULL,
    initial_display_state_id bigint NOT NULL,
    current_display_state_id bigint NOT NULL,
    status_tracking character varying NOT NULL,
    panel_subtype_type character varying NOT NULL,
    panel_subtype_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    display_index integer,
    CONSTRAINT non_negative_display_index CHECK ((display_index >= 0))
);


--
-- Name: hint_panels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hint_panels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hint_panels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hint_panels_id_seq OWNED BY public.hint_panels.id;


--
-- Name: letter_panels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.letter_panels (
    id bigint NOT NULL,
    location public.letter_panel_locations DEFAULT 'start'::public.letter_panel_locations NOT NULL,
    output_type public.substring_hint_output_types DEFAULT 'letters_list'::public.substring_hint_output_types NOT NULL,
    number_of_letters integer DEFAULT 1 NOT NULL,
    letters_offset integer DEFAULT 0 NOT NULL,
    hide_known boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    CONSTRAINT no_negative_offset CHECK ((letters_offset >= 0)),
    CONSTRAINT positive_number_of_letters CHECK ((number_of_letters > 0))
);


--
-- Name: letter_panels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.letter_panels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: letter_panels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.letter_panels_id_seq OWNED BY public.letter_panels.id;


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
-- Name: obscurity_panels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.obscurity_panels (
    id bigint NOT NULL,
    hide_known boolean DEFAULT true NOT NULL,
    separate_known boolean DEFAULT false NOT NULL,
    reveal_length boolean DEFAULT true NOT NULL,
    click_to_define boolean DEFAULT false NOT NULL,
    sort_order public.sort_order_options DEFAULT 'asc'::public.sort_order_options NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    revealed_letters integer,
    CONSTRAINT positive_revealed_letters CHECK ((revealed_letters > 0))
);


--
-- Name: obscurity_panels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.obscurity_panels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: obscurity_panels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.obscurity_panels_id_seq OWNED BY public.obscurity_panels.id;


--
-- Name: panel_display_states; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.panel_display_states (
    id bigint NOT NULL,
    is_expanded boolean DEFAULT true NOT NULL,
    is_blurred boolean DEFAULT true NOT NULL,
    is_sticky boolean DEFAULT true NOT NULL,
    is_settings_expanded boolean DEFAULT true NOT NULL,
    is_settings_sticky boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: panel_display_states_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.panel_display_states_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: panel_display_states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.panel_display_states_id_seq OWNED BY public.panel_display_states.id;


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
    updated_at timestamp(6) without time zone NOT NULL,
    excluded_words character varying[]
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
-- Name: search_panel_searches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_panel_searches (
    id bigint NOT NULL,
    search_panel_id bigint NOT NULL,
    user_puzzle_attempt_id bigint NOT NULL,
    location public.search_panel_locations DEFAULT 'anywhere'::public.search_panel_locations NOT NULL,
    output_type public.substring_hint_output_types DEFAULT 'letters_list'::public.substring_hint_output_types NOT NULL,
    letters_offset integer,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    search_string character varying,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL,
    CONSTRAINT no_negative_offset CHECK ((letters_offset >= 0))
);


--
-- Name: search_panel_searches_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.search_panel_searches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: search_panel_searches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.search_panel_searches_id_seq OWNED BY public.search_panel_searches.id;


--
-- Name: search_panels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.search_panels (
    id bigint NOT NULL,
    location public.search_panel_locations DEFAULT 'anywhere'::public.search_panel_locations NOT NULL,
    output_type public.substring_hint_output_types DEFAULT 'letters_list'::public.substring_hint_output_types NOT NULL,
    letters_offset integer DEFAULT 0 NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    CONSTRAINT no_negative_offset CHECK ((letters_offset >= 0))
);


--
-- Name: search_panels_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.search_panels_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: search_panels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.search_panels_id_seq OWNED BY public.search_panels.id;


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
-- Name: user_hint_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_hint_profiles (
    id bigint NOT NULL,
    name character varying,
    user_id bigint NOT NULL,
    default_panel_tracking character varying NOT NULL,
    default_panel_display_state_id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


--
-- Name: user_hint_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_hint_profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_hint_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_hint_profiles_id_seq OWNED BY public.user_hint_profiles.id;


--
-- Name: user_prefs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_prefs (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    color_scheme public.user_color_scheme DEFAULT 'auto'::public.user_color_scheme NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    current_hint_profile_type character varying,
    current_hint_profile_id bigint
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
    updated_at timestamp(6) without time zone NOT NULL,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL
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
    jti character varying NOT NULL,
    confirmation_token character varying,
    confirmed_at timestamp(6) without time zone,
    confirmation_sent_at timestamp(6) without time zone,
    unconfirmed_email character varying,
    failed_attempts integer DEFAULT 0 NOT NULL,
    locked_at timestamp(6) without time zone,
    unlock_token character varying
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
-- Name: default_hint_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_hint_profiles ALTER COLUMN id SET DEFAULT nextval('public.default_hint_profiles_id_seq'::regclass);


--
-- Name: definition_panels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.definition_panels ALTER COLUMN id SET DEFAULT nextval('public.definition_panels_id_seq'::regclass);


--
-- Name: guesses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guesses ALTER COLUMN id SET DEFAULT nextval('public.guesses_id_seq'::regclass);


--
-- Name: hint_panels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hint_panels ALTER COLUMN id SET DEFAULT nextval('public.hint_panels_id_seq'::regclass);


--
-- Name: letter_panels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.letter_panels ALTER COLUMN id SET DEFAULT nextval('public.letter_panels_id_seq'::regclass);


--
-- Name: nyt_puzzles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nyt_puzzles ALTER COLUMN id SET DEFAULT nextval('public.nyt_puzzles_id_seq'::regclass);


--
-- Name: obscurity_panels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.obscurity_panels ALTER COLUMN id SET DEFAULT nextval('public.obscurity_panels_id_seq'::regclass);


--
-- Name: panel_display_states id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.panel_display_states ALTER COLUMN id SET DEFAULT nextval('public.panel_display_states_id_seq'::regclass);


--
-- Name: puzzles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.puzzles ALTER COLUMN id SET DEFAULT nextval('public.puzzles_id_seq'::regclass);


--
-- Name: sb_solver_puzzles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sb_solver_puzzles ALTER COLUMN id SET DEFAULT nextval('public.sb_solver_puzzles_id_seq'::regclass);


--
-- Name: search_panel_searches id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_panel_searches ALTER COLUMN id SET DEFAULT nextval('public.search_panel_searches_id_seq'::regclass);


--
-- Name: search_panels id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_panels ALTER COLUMN id SET DEFAULT nextval('public.search_panels_id_seq'::regclass);


--
-- Name: user_hint_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_hint_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_hint_profiles_id_seq'::regclass);


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
-- Name: default_hint_profiles default_hint_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.default_hint_profiles
    ADD CONSTRAINT default_hint_profiles_pkey PRIMARY KEY (id);


--
-- Name: definition_panels definition_panels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.definition_panels
    ADD CONSTRAINT definition_panels_pkey PRIMARY KEY (id);


--
-- Name: guesses guesses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guesses
    ADD CONSTRAINT guesses_pkey PRIMARY KEY (id);


--
-- Name: hint_panels hint_panels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hint_panels
    ADD CONSTRAINT hint_panels_pkey PRIMARY KEY (id);


--
-- Name: letter_panels letter_panels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.letter_panels
    ADD CONSTRAINT letter_panels_pkey PRIMARY KEY (id);


--
-- Name: nyt_puzzles nyt_puzzles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nyt_puzzles
    ADD CONSTRAINT nyt_puzzles_pkey PRIMARY KEY (id);


--
-- Name: obscurity_panels obscurity_panels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.obscurity_panels
    ADD CONSTRAINT obscurity_panels_pkey PRIMARY KEY (id);


--
-- Name: panel_display_states panel_display_states_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.panel_display_states
    ADD CONSTRAINT panel_display_states_pkey PRIMARY KEY (id);


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
-- Name: search_panel_searches search_panel_searches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_panel_searches
    ADD CONSTRAINT search_panel_searches_pkey PRIMARY KEY (id);


--
-- Name: search_panels search_panels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_panels
    ADD CONSTRAINT search_panels_pkey PRIMARY KEY (id);


--
-- Name: user_hint_profiles user_hint_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_hint_profiles
    ADD CONSTRAINT user_hint_profiles_pkey PRIMARY KEY (id);


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
-- Name: index_guesses_on_uuid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_guesses_on_uuid ON public.guesses USING btree (uuid);


--
-- Name: index_hint_panels_on_current_display_state_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_hint_panels_on_current_display_state_id ON public.hint_panels USING btree (current_display_state_id);


--
-- Name: index_hint_panels_on_hint_profile; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_hint_panels_on_hint_profile ON public.hint_panels USING btree (hint_profile_type, hint_profile_id);


--
-- Name: index_hint_panels_on_initial_display_state_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_hint_panels_on_initial_display_state_id ON public.hint_panels USING btree (initial_display_state_id);


--
-- Name: index_hint_panels_on_panel_subtype; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_hint_panels_on_panel_subtype ON public.hint_panels USING btree (panel_subtype_type, panel_subtype_id);


--
-- Name: index_hint_panels_on_status_tracking; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_hint_panels_on_status_tracking ON public.hint_panels USING btree (status_tracking);


--
-- Name: index_puzzles_on_excluded_words; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_puzzles_on_excluded_words ON public.puzzles USING gin (excluded_words);


--
-- Name: index_puzzles_on_origin; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_puzzles_on_origin ON public.puzzles USING btree (origin_type, origin_id);


--
-- Name: index_puzzles_on_outer_letters; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_puzzles_on_outer_letters ON public.puzzles USING gin (outer_letters);


--
-- Name: index_search_panel_searches_on_search_panel_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_search_panel_searches_on_search_panel_id ON public.search_panel_searches USING btree (search_panel_id);


--
-- Name: index_search_panel_searches_on_user_puzzle_attempt_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_search_panel_searches_on_user_puzzle_attempt_id ON public.search_panel_searches USING btree (user_puzzle_attempt_id);


--
-- Name: index_search_panel_searches_on_uuid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_search_panel_searches_on_uuid ON public.search_panel_searches USING btree (uuid);


--
-- Name: index_status_tracking_options_on_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_status_tracking_options_on_key ON public.status_tracking_options USING btree (key);


--
-- Name: index_user_hint_profiles_on_default_panel_display_state_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_hint_profiles_on_default_panel_display_state_id ON public.user_hint_profiles USING btree (default_panel_display_state_id);


--
-- Name: index_user_hint_profiles_on_default_panel_tracking; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_hint_profiles_on_default_panel_tracking ON public.user_hint_profiles USING btree (default_panel_tracking);


--
-- Name: index_user_hint_profiles_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_hint_profiles_on_user_id ON public.user_hint_profiles USING btree (user_id);


--
-- Name: index_user_prefs_on_current_hint_profile; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_user_prefs_on_current_hint_profile ON public.user_prefs USING btree (current_hint_profile_type, current_hint_profile_id);


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
-- Name: index_user_puzzle_attempts_on_uuid; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_user_puzzle_attempts_on_uuid ON public.user_puzzle_attempts USING btree (uuid);


--
-- Name: index_users_on_confirmation_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_confirmation_token ON public.users USING btree (confirmation_token);


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
-- Name: index_users_on_unlock_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_unlock_token ON public.users USING btree (unlock_token);


--
-- Name: index_words_on_definitions; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_words_on_definitions ON public.words USING gin (definitions);


--
-- Name: index_words_on_text; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_words_on_text ON public.words USING btree (text);


--
-- Name: search_panel_searches fk_rails_153f638c99; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_panel_searches
    ADD CONSTRAINT fk_rails_153f638c99 FOREIGN KEY (user_puzzle_attempt_id) REFERENCES public.user_puzzle_attempts(id);


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
-- Name: search_panel_searches fk_rails_90b0eead18; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.search_panel_searches
    ADD CONSTRAINT fk_rails_90b0eead18 FOREIGN KEY (search_panel_id) REFERENCES public.search_panels(id);


--
-- Name: user_hint_profiles fk_rails_964518a402; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_hint_profiles
    ADD CONSTRAINT fk_rails_964518a402 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: hint_panels fk_rails_9a68662294; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hint_panels
    ADD CONSTRAINT fk_rails_9a68662294 FOREIGN KEY (status_tracking) REFERENCES public.status_tracking_options(key);


--
-- Name: user_hint_profiles fk_rails_b0ab1b718f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_hint_profiles
    ADD CONSTRAINT fk_rails_b0ab1b718f FOREIGN KEY (default_panel_display_state_id) REFERENCES public.panel_display_states(id);


--
-- Name: hint_panels fk_rails_c1e169d339; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hint_panels
    ADD CONSTRAINT fk_rails_c1e169d339 FOREIGN KEY (initial_display_state_id) REFERENCES public.panel_display_states(id);


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
-- Name: user_hint_profiles fk_rails_ea7cf43e6d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_hint_profiles
    ADD CONSTRAINT fk_rails_ea7cf43e6d FOREIGN KEY (default_panel_tracking) REFERENCES public.status_tracking_options(key);


--
-- Name: guesses fk_rails_fd6386492d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.guesses
    ADD CONSTRAINT fk_rails_fd6386492d FOREIGN KEY (user_puzzle_attempt_uuid) REFERENCES public.user_puzzle_attempts(uuid);


--
-- Name: hint_panels fk_rails_fe2308349e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hint_panels
    ADD CONSTRAINT fk_rails_fe2308349e FOREIGN KEY (current_display_state_id) REFERENCES public.panel_display_states(id);


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
('20230815032425'),
('20230815050500'),
('20230815052132'),
('20230815052939'),
('20230815055235'),
('20230815055236'),
('20230815062841'),
('20230815063617'),
('20230815064048'),
('20230815064457'),
('20230815065033'),
('20230815073035'),
('20230816121754'),
('20230818004354'),
('20230828060858'),
('20230828115156'),
('20230911051856'),
('20230912194527'),
('20230912210851'),
('20230912212040'),
('20230913100015'),
('20231001001349'),
('20231002213304'),
('20231011153938'),
('20231119195913'),
('20231120084355'),
('20231120090819'),
('20231127233418');


