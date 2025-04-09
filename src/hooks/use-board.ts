import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from './use-toast';
import { Board, TypedSupabaseClient } from '@/lib/types';

export default function useBoard(supabase: TypedSupabaseClient, fetchedBoard: Board) {
    const { toast } = useToast();

    const [board, setBoard] = useState<Board>(fetchedBoard);
    const [coverPreview, setCoverPreview] = useState<string | undefined>(undefined);
    const [uploadingPreview, setUploadingPreview] = useState(false);

    const coverPathRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (board.cover_path) {
            const { data: publicUrl } = supabase.storage
                .from("covers")
                .getPublicUrl(board.cover_path);

            setCoverPreview(publicUrl.publicUrl);
        }
    }, [])

    const handleChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        setUploadingPreview(true);

        if (!e.target.files || e.target.files?.length === 0) {
            setUploadingPreview(false);
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const filePath = `${board.id}/cover_${Date.now()}.${fileExt}`;

        const uploadCoverPromise = supabase.storage
            .from("covers")
            .upload(filePath, file);

        const updateBoardPromise = supabase
            .from("boards")
            .update({
                cover_path: filePath,
            })
            .eq("id", board.id);

        const [uploadCoverResponse, updateBoardResponse] = await Promise.all([uploadCoverPromise, updateBoardPromise])

        if (uploadCoverResponse.error || updateBoardResponse.error) {
            toast({
                title: "Something went wrong...",
                description: "We could not update this board's cover. Please try again.",
            });

            setUploadingPreview(false);
            return;
        }

        const { data: publicUrl } = supabase.storage
            .from("covers")
            .getPublicUrl(filePath);

        setCoverPreview(publicUrl.publicUrl);
        setUploadingPreview(false);

        toast({
            title: "Success!",
            description: "The cover has been successfully updated.",
        });
    }, [board])

    const bookmarkBoard = useCallback(async (boardId: string, profileId: string, currentlyBookmarked: boolean) => {
        setBoard((prevBoard) => {
            return {
                ...prevBoard,
                bookmarked: !currentlyBookmarked,
            }
        })

        const { error: bookmarkError } = await supabase
            .from("profiles_boards_bridge")
            .update({bookmarked: !currentlyBookmarked})
            .match({profile_id: profileId, board_id: boardId});

        if (bookmarkError) throw bookmarkError;
    }, [board])

    const renameBoard = useCallback(async (oldTitle: string, newTitle: string, boardId: string) => {
        if (oldTitle === newTitle) return;

        setBoard((prevBoard) => {
            return {
                ...prevBoard,
                title: newTitle,
            }
        })

        const { error: renameError } = await supabase
            .from("boards")
            .update({title: newTitle})
            .eq("id", boardId);

        if (renameError) throw renameError;
    }, [board])

  return { board, coverPreview, uploadingPreview, handleChange, bookmarkBoard, renameBoard, coverPathRef };
}
