drop trigger if exists "on_board_created" on "public"."boards";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_board()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$BEGIN
  INSERT INTO public.profiles_boards_bridge (profile_id, board_id)
  VALUES (NEW.profile_id, NEW.id);

  INSERT INTO public.columns (board_id)
  VALUES (NEW.id);

  INSERT INTO public.cards (board_id)
  VALUES (NEW.id);

  RETURN NEW;
END;$function$
;

CREATE TRIGGER on_board_created AFTER INSERT ON public.boards FOR EACH ROW EXECUTE FUNCTION handle_new_board();


