import { TypedSupabaseClient, UserProfile } from '@/lib/types';
import { useEffect, useState } from 'react'

export default function usePresence(supabase: TypedSupabaseClient, boardId: string, userProfile: UserProfile) {
    const [activeProfiles, setActiveProfiles] = useState<UserProfile[]>([]);

    useEffect(() => {
        const presenceChannel = supabase
            .channel(`presence:${boardId}`, {
                config: {
                    presence: {
                        key: userProfile.id,
                    },
                },
            })
            .on('presence', { event: 'sync' }, () => {
                const presentState = presenceChannel.presenceState<UserProfile>()
                setActiveProfiles(Object.values(presentState).flat() as UserProfile[]);
            })
            .on('presence', { event: 'leave' }, () => {
                const presentState = presenceChannel.presenceState<UserProfile>()
                setActiveProfiles(Object.values(presentState).flat() as UserProfile[]);
            })
            .on('presence', { event: 'join' }, () => {
                const presentState = presenceChannel.presenceState<UserProfile>()
                setActiveProfiles(Object.values(presentState).flat() as UserProfile[]);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({
                        ...userProfile as UserProfile,
                    })
                }
            });

        return () => {
            supabase.removeChannel(presenceChannel);
        };
    }, [userProfile])

    return { activeProfiles };
}
