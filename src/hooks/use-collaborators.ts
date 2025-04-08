import { TypedSupabaseClient, UserProfile } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react'
import { CollaboratorFormState, EmailFormSchema } from '@/lib/definitions';
import { redirect } from 'next/navigation';

export default function useCollaborators(supabase: TypedSupabaseClient, boardId: string, fetchedCollaborators: UserProfile[]) {
    const [collaborators, setCollaborators] = useState<UserProfile[]>(fetchedCollaborators);

    useEffect(() => {
        async function setSupabaseAuth() {
            await supabase.realtime.setAuth()
        }

        setSupabaseAuth();

        const collaboratorsChannel = supabase
            .channel(`collaborators:${boardId}`)
            .on(
                'broadcast',
                { event: 'INSERT' },
                (payload) => {
                    console.log(payload)
                    const updatedCollaborators = [
                        ...collaborators,
                        payload.payload as UserProfile,
                    ]

                    setCollaborators(updatedCollaborators)
                })
            .on(
                'broadcast',
                { event: 'DELETE' },
                (payload) => {
                    console.log(payload)
                    const updatedCollaborators = collaborators.filter((collaborator) => collaborator.id !== payload.payload.profile_id)

                    setCollaborators(updatedCollaborators)
                })
            .subscribe()

        return () => {
            supabase.removeChannel(collaboratorsChannel);
        };
    }, [supabase, collaborators, setCollaborators]);

   const addCollaborator = useCallback(async (formState: CollaboratorFormState, formData: FormData) => {
        const validatedFields = EmailFormSchema.safeParse({
            email: formData.get("email"),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        try {
            const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("email", validatedFields.data.email)
                .single();

            if (profileError) throw profileError;

            const { data: collaboratorData } = await supabase
                .from("profiles_boards_bridge")
                .select("*")
                .match({profile_id: profileData.id, board_id: boardId})
                .single();

            if (collaboratorData !== null) {
                return {
                    errors: {
                        email: ["User is already a collaborator for this board"]
                    }
                }
            }

            const { error: addCollaboratorError } = await supabase
                .from("profiles_boards_bridge")
                .insert({profile_id: profileData.id, board_id: boardId})

            if (addCollaboratorError) throw addCollaboratorError
        } catch {
            return {
                toast: {
                    title: "Something went wrong...",
                    message: "We could not invite this user. Please try again.",
                },
            }
        }
    }, [collaborators])

    const removeCollaborator = useCallback(async (boardId: string, removedId: string, removerId: string) => {
        const { error: removeCollaboratorError } = await supabase
            .from("profiles_boards_bridge")
            .delete()
            .match({ profile_id: removedId, board_id: boardId })

        if (removeCollaboratorError) throw removeCollaboratorError;

        if (removedId === removerId) redirect("/dashboard")
    }, [collaborators])

    return {collaborators, addCollaborator, removeCollaborator};
}
