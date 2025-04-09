import { ChangeEvent, useCallback, useRef, useState } from 'react'
import { uploadAvatar } from '@/lib/actions';
import { useToast } from './use-toast';

export default function useAvatar(profileId: string) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const { toast } = useToast();

    const avatarInputRef = useRef<HTMLInputElement | null>(null);

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

        const { toast: resultToast } = await uploadAvatar(profileId, file);

        toast({
            title: resultToast.title,
            description: resultToast.message,
        });

        setUploading(false);
    }, [])

  return { uploading, changeAvatar, avatarInputRef };
}
