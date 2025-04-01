import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { uploadAvatar } from '@/lib/actions';
import { useToast } from './use-toast';

export default function useAvatar(userId: string, publicUrl: string) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const { toast } = useToast();

    const avatarInputRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState(publicUrl);
    const [uploading, setUploading] = useState(false);

    const changeAvatar = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        setUploading(true);

        if (!e.target.files || e.target.files?.length === 0) {
            setUploading(false);
            return;
        }

        if (e.target.files[0].size > MAX_FILE_SIZE) {
            setUploading(false);
            return;
        }

        const file = e.target.files[0];

        const { publicUrl, errorMessage } = await uploadAvatar(
            userId,
            file,
        );

        if (publicUrl) {
            setPreview(publicUrl);

            toast({
                title: "Success!",
                description: "Your avatar has been successfully updated.",
            });
        } else if (errorMessage) {
            toast({
                title: "Something went wrong...!",
                description: errorMessage,
            });
        }

        setUploading(false);
    }, [])

  return { preview, uploading, changeAvatar, avatarInputRef };
}
