drop function if exists "public"."handle_password_change"(current text, new text, userid uuid);

drop function if exists "public"."handle_password_change"(newpassword text, userid uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_password_change(newpassword text, userid uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$BEGIN
  UPDATE auth.users 
  SET encrypted_password = extensions.crypt(newpassword, extensions.gen_salt('bf')) 
  WHERE id = userid;
END;$function$
;


