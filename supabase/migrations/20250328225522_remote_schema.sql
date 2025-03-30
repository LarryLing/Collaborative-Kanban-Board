

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


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_delete_user"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    DELETE FROM auth.users WHERE auth.uid()  = id;
END
$$;


ALTER FUNCTION "public"."handle_delete_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_board"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$BEGIN
  INSERT INTO public.profiles_boards_bridge (profile_id, board_id)
  VALUES (NEW.profile_id, NEW.id);

  INSERT INTO public.columns (board_id)
  VALUES (NEW.id);

  INSERT INTO public.cards (board_id)
  VALUES (NEW.id);

  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."handle_new_board"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$DECLARE
  insert_display_name TEXT;
BEGIN
  -- Check if the username is provided
  IF NEW.raw_user_meta_data ->> 'display_name' IS NOT NULL THEN
    insert_display_name := NEW.raw_user_meta_data ->> 'display_name';
  ELSE
    -- Use the email to generate a base username (remove everything after '@')
    insert_display_name := split_part(NEW.email, '@', 1);
  END IF;

  -- Insert into the profiles table with the new or provided username
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (NEW.id, insert_display_name, NEW.email);

  INSERT INTO public.socials (profile_id)
  VALUES (NEW.id);

  INSERT INTO public.socials (profile_id)
  VALUES (NEW.id);

  INSERT INTO public.socials (profile_id)
  VALUES (NEW.id);

  INSERT INTO public.socials (profile_id)
  VALUES (NEW.id);

  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_password_change"("newpassword" "text", "userid" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$BEGIN
  UPDATE auth.users 
  SET encrypted_password = extensions.crypt(newpassword, extensions.gen_salt('bf')) 
  WHERE id = userid;
END;$$;


ALTER FUNCTION "public"."handle_password_change"("newpassword" "text", "userid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_update_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
UPDATE public.profiles
SET email = NEW.email
WHERE id = NEW.id;
RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_update_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."boards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" DEFAULT 'Untitled Board'::"text" NOT NULL,
    "cover_path" "text",
    "last_opened" timestamp with time zone DEFAULT "now"() NOT NULL,
    "bookmarked" boolean DEFAULT false NOT NULL,
    "collaborators" bigint DEFAULT '1'::bigint NOT NULL
);


ALTER TABLE "public"."boards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "board_id" "uuid" NOT NULL,
    "cards" "jsonb"[] DEFAULT '{}'::"jsonb"[] NOT NULL
);


ALTER TABLE "public"."cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."columns" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "board_id" "uuid" NOT NULL,
    "columns" "jsonb"[] DEFAULT '{}'::"jsonb"[] NOT NULL
);


ALTER TABLE "public"."columns" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "display_name" "text" DEFAULT ''::"text" NOT NULL,
    "email" "text" DEFAULT ''::"text" NOT NULL,
    "about_me" "text" DEFAULT ''::"text" NOT NULL,
    "avatar_path" "text"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles_boards_bridge" (
    "profile_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "board_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."profiles_boards_bridge" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."socials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "url" "text" DEFAULT ''::"text" NOT NULL,
    "profile_id" "uuid" NOT NULL
);


ALTER TABLE "public"."socials" OWNER TO "postgres";


ALTER TABLE ONLY "public"."boards"
    ADD CONSTRAINT "boards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."columns"
    ADD CONSTRAINT "columns_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles_boards_bridge"
    ADD CONSTRAINT "profiles_boards_bridge_pkey" PRIMARY KEY ("profile_id", "board_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."socials"
    ADD CONSTRAINT "socials_pkey" PRIMARY KEY ("id");



CREATE INDEX "boards_profile_id_idx" ON "public"."boards" USING "btree" ("profile_id");



CREATE INDEX "cards_board_id_idx" ON "public"."cards" USING "btree" ("board_id");



CREATE INDEX "columns_board_id_idx" ON "public"."columns" USING "btree" ("board_id");



CREATE INDEX "profiles_boards_bridge_board_id_idx" ON "public"."profiles_boards_bridge" USING "btree" ("board_id");



CREATE INDEX "profiles_boards_bridge_profile_id_idx" ON "public"."profiles_boards_bridge" USING "btree" ("profile_id");



CREATE INDEX "profiles_id_idx" ON "public"."profiles" USING "btree" ("id");



CREATE INDEX "socials_profile_id_idx" ON "public"."socials" USING "btree" ("profile_id");



CREATE OR REPLACE TRIGGER "on_board_created" AFTER INSERT ON "public"."boards" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_board"();



ALTER TABLE ONLY "public"."boards"
    ADD CONSTRAINT "boards_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "cards_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."columns"
    ADD CONSTRAINT "columns_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles_boards_bridge"
    ADD CONSTRAINT "profiles_boards_bridge_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles_boards_bridge"
    ADD CONSTRAINT "profiles_boards_bridge_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."socials"
    ADD CONSTRAINT "socials_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Enable all for authenticated users only" ON "public"."cards" USING ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text")) WITH CHECK (true);



CREATE POLICY "Enable all for authenticated users only" ON "public"."columns" USING ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text")) WITH CHECK (true);



CREATE POLICY "Enable delete based on user_id" ON "public"."boards" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable delete based on user_id" ON "public"."socials" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."boards" FOR INSERT WITH CHECK ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."profiles_boards_bridge" FOR INSERT WITH CHECK ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."socials" FOR INSERT WITH CHECK ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



CREATE POLICY "Enable select for authenticated users only" ON "public"."boards" FOR SELECT USING ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



CREATE POLICY "Enable select for authenticated users only" ON "public"."profiles" FOR SELECT USING ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



CREATE POLICY "Enable select for authenticated users only" ON "public"."profiles_boards_bridge" FOR SELECT USING ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



CREATE POLICY "Enable select for authenticated users only" ON "public"."socials" FOR SELECT USING ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



CREATE POLICY "Enable update based on user_id" ON "public"."boards" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "profile_id"));



CREATE POLICY "Enable update based on user_id" ON "public"."profiles" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."boards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."columns" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles_boards_bridge" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."socials" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."cards";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."columns";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_delete_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_delete_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_delete_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_board"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_board"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_board"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_password_change"("newpassword" "text", "userid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."handle_password_change"("newpassword" "text", "userid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_password_change"("newpassword" "text", "userid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_update_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_update_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_update_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."boards" TO "anon";
GRANT ALL ON TABLE "public"."boards" TO "authenticated";
GRANT ALL ON TABLE "public"."boards" TO "service_role";



GRANT ALL ON TABLE "public"."cards" TO "anon";
GRANT ALL ON TABLE "public"."cards" TO "authenticated";
GRANT ALL ON TABLE "public"."cards" TO "service_role";



GRANT ALL ON TABLE "public"."columns" TO "anon";
GRANT ALL ON TABLE "public"."columns" TO "authenticated";
GRANT ALL ON TABLE "public"."columns" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."profiles_boards_bridge" TO "anon";
GRANT ALL ON TABLE "public"."profiles_boards_bridge" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles_boards_bridge" TO "service_role";



GRANT ALL ON TABLE "public"."socials" TO "anon";
GRANT ALL ON TABLE "public"."socials" TO "authenticated";
GRANT ALL ON TABLE "public"."socials" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
