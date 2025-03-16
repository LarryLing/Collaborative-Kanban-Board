drop policy "User can only insert own social data" on "public"."socials";

drop policy "Users can select all social data" on "public"."socials";

create table "public"."boards" (
    "board_id" uuid not null default gen_random_uuid(),
    "profile_id" uuid not null default gen_random_uuid(),
    "title" text not null default ''::text,
    "cover_path" text,
    "last_opened" timestamp with time zone not null default now(),
    "bookmarked" boolean not null default false,
    "collaborators" bigint not null default '1'::bigint
);


alter table "public"."boards" enable row level security;

create table "public"."profiles_boards_bridge" (
    "profile_id" uuid not null default gen_random_uuid(),
    "board_id" uuid not null default gen_random_uuid()
);


alter table "public"."profiles_boards_bridge" enable row level security;

alter table "public"."profiles" alter column "about_me" set not null;

alter table "public"."profiles" alter column "avatar_path" set default ''::text;

CREATE UNIQUE INDEX boards_pkey ON public.boards USING btree (board_id);

CREATE UNIQUE INDEX profiles_boards_bridge_pkey ON public.profiles_boards_bridge USING btree (profile_id, board_id);

alter table "public"."boards" add constraint "boards_pkey" PRIMARY KEY using index "boards_pkey";

alter table "public"."profiles_boards_bridge" add constraint "profiles_boards_bridge_pkey" PRIMARY KEY using index "profiles_boards_bridge_pkey";

alter table "public"."boards" add constraint "boards_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."boards" validate constraint "boards_profile_id_fkey";

alter table "public"."profiles_boards_bridge" add constraint "profiles_boards_bridge_board_id_fkey" FOREIGN KEY (board_id) REFERENCES boards(board_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles_boards_bridge" validate constraint "profiles_boards_bridge_board_id_fkey";

alter table "public"."profiles_boards_bridge" add constraint "profiles_boards_bridge_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles_boards_bridge" validate constraint "profiles_boards_bridge_profile_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_board()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  INSERT INTO public.profiles_boards_bridge (profile_id, board_id)
  VALUES (NEW.profile_id, NEW.board_id);
  RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$DECLARE
  insert_display_name TEXT;
BEGIN
  -- Check if the username is provided
  IF NEW.raw_user_meta_data ->> 'display_name' IS NOT NULL THEN
    insert_display_name := NEW.raw_user_meta_data ->> 'insert_display_name';
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
END;$function$
;

grant delete on table "public"."boards" to "anon";

grant insert on table "public"."boards" to "anon";

grant references on table "public"."boards" to "anon";

grant select on table "public"."boards" to "anon";

grant trigger on table "public"."boards" to "anon";

grant truncate on table "public"."boards" to "anon";

grant update on table "public"."boards" to "anon";

grant delete on table "public"."boards" to "authenticated";

grant insert on table "public"."boards" to "authenticated";

grant references on table "public"."boards" to "authenticated";

grant select on table "public"."boards" to "authenticated";

grant trigger on table "public"."boards" to "authenticated";

grant truncate on table "public"."boards" to "authenticated";

grant update on table "public"."boards" to "authenticated";

grant delete on table "public"."boards" to "service_role";

grant insert on table "public"."boards" to "service_role";

grant references on table "public"."boards" to "service_role";

grant select on table "public"."boards" to "service_role";

grant trigger on table "public"."boards" to "service_role";

grant truncate on table "public"."boards" to "service_role";

grant update on table "public"."boards" to "service_role";

grant delete on table "public"."profiles_boards_bridge" to "anon";

grant insert on table "public"."profiles_boards_bridge" to "anon";

grant references on table "public"."profiles_boards_bridge" to "anon";

grant select on table "public"."profiles_boards_bridge" to "anon";

grant trigger on table "public"."profiles_boards_bridge" to "anon";

grant truncate on table "public"."profiles_boards_bridge" to "anon";

grant update on table "public"."profiles_boards_bridge" to "anon";

grant delete on table "public"."profiles_boards_bridge" to "authenticated";

grant insert on table "public"."profiles_boards_bridge" to "authenticated";

grant references on table "public"."profiles_boards_bridge" to "authenticated";

grant select on table "public"."profiles_boards_bridge" to "authenticated";

grant trigger on table "public"."profiles_boards_bridge" to "authenticated";

grant truncate on table "public"."profiles_boards_bridge" to "authenticated";

grant update on table "public"."profiles_boards_bridge" to "authenticated";

grant delete on table "public"."profiles_boards_bridge" to "service_role";

grant insert on table "public"."profiles_boards_bridge" to "service_role";

grant references on table "public"."profiles_boards_bridge" to "service_role";

grant select on table "public"."profiles_boards_bridge" to "service_role";

grant trigger on table "public"."profiles_boards_bridge" to "service_role";

grant truncate on table "public"."profiles_boards_bridge" to "service_role";

grant update on table "public"."profiles_boards_bridge" to "service_role";

create policy "User can only delete own boards data"
on "public"."boards"
as permissive
for delete
to public
using ((auth.uid() = profile_id));


create policy "User can only update own boards data"
on "public"."boards"
as permissive
for update
to public
using ((auth.uid() = profile_id));


create policy "User can select boards data"
on "public"."boards"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));


create policy "Users can create boards data"
on "public"."boards"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Users can select bridge data"
on "public"."profiles_boards_bridge"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));


create policy "User can insert social data"
on "public"."socials"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Users can select social data"
on "public"."socials"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));


CREATE TRIGGER handle_new_board AFTER INSERT ON public.boards FOR EACH ROW EXECUTE FUNCTION handle_new_board();


