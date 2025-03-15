set check_function_bodies = off;

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

  RETURN NEW;
END;$function$
;


