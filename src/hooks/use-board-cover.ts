import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { useToast } from './use-toast';
import { uploadCover } from '@/lib/actions';

export default function useBoardCover(boardId: string, boardCover: string | null) {
    const { toast } = useToast();

    const [coverPreview, setCoverPreview] = useState(boardCover);
    const [uploading, setUploading] = useState(false);

    const coverPathRef = useRef<HTMLInputElement | null>(null);

    const handleChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        setUploading(true);

        if (!e.target.files || e.target.files?.length === 0) {
            setUploading(false);
            return;
        }

        const file = e.target.files[0];

        const { publicUrl, errorMessage } = await uploadCover(boardId, file);

        if (publicUrl) {
            setCoverPreview(publicUrl);

            toast({
                title: "Success!",
                description: "The cover has been successfully updated.",
            });
        } else if (errorMessage) {
            toast({
                title: "Something went wrong...",
                description: errorMessage,
            });
        }

        setUploading(false);
    }, [])

  return { coverPreview, uploading, handleChange, coverPathRef };
}
