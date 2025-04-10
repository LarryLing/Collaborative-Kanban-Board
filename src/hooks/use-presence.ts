import { TypedSupabaseClient, UserProfile } from '@/lib/types';
import { useEffect, useState } from 'react'
import { RealtimePresenceState } from '@supabase/supabase-js';
import { selectProfileByProfileId } from '@/lib/queries';

export default function usePresence(supabase: TypedSupabaseClient, boardId: string, profileId: string) {
    const [userState, setUserState] = useState<RealtimePresenceState>({});
    const [activeProfiles, setActiveProfiles] = useState<UserProfile[]>([]);

    useEffect(() => {
        async function addActiveProfile(profileId: string) {
            const { data: profileData, error: profileError } = await selectProfileByProfileId(supabase, profileId)

            if (profileError) throw profileError;

            setActiveProfiles((prev) => {
                return [...prev, profileData]
            })
        }

        const presenceChannel = supabase
            .channel(`presence:${boardId}`, {
                config: {
                    presence: {
                        key: profileId,
                    },
                },
            })
            .on('presence', { event: 'sync' }, () => {
                const presentState = presenceChannel.presenceState()

                // console.log('inside presence: ', presentState)

                setUserState({ ...presentState })
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                // console.log('leave', key, leftPresences)

                setActiveProfiles((prev) => {
                    return prev.filter((activeProfile) => activeProfile.id !== key);
                });
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                // console.log('join', key, newPresences)

                addActiveProfile(key);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    const status = await presenceChannel.track({
                        profile_id: profileId,
                    })
                    // console.log('status: ', status)
                }
            });

        return () => {
            supabase.removeChannel(presenceChannel);
        };
    }, [])

    return { userState, activeProfiles };
}
