set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_password_change(newpassword text, userid uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  UPDATE auth.users 
  SET encrypted_password = crypt(newpassword, gen_salt('bf')) 
  WHERE id = userid;
END;$function$
;


