import { Collaborator, TypedSupabaseClient } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react'
import { CollaboratorFormState, EmailFormSchema } from '@/lib/definitions';
import { redirect } from 'next/navigation';

export default function useCollaborators(supabase: TypedSupabaseClient, boardId: string, viewerId: string, fetchCollaborators: Collaborator[]) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>(fetchCollaborators);

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
                    const updatedCollaborators = [
                        ...collaborators,
                        {
                            ...payload.payload,
                            avatar_url: supabase.storage.from("avatars").getPublicUrl(payload.payload.avatar_path).data.publicUrl,
                        } as Collaborator
                    ]

                    setCollaborators(updatedCollaborators)
                })
            .on(
                'broadcast',
                { event: 'DELETE' },
                (payload) => {
                    if (payload.payload.profile_id === viewerId) redirect("/dashboard")

                    const updatedCollaborators = collaborators.filter((collaborator) => collaborator.profile_id !== payload.payload.profile_id)

                    setCollaborators(updatedCollaborators)
                })
            .on(
                'broadcast',
                { event: 'UPDATE' },
                (payload) => {
                    const updatedCollaborators = collaborators.map((collaborator) => {
                        if (collaborator.profile_id === payload.payload.profile_id) {
                            return {
                                ...collaborator,
                                has_invite_permissions: payload.payload.has_invite_permissions,
                            };
                        }
                        return collaborator;
                    });

                    setCollaborators(updatedCollaborators);
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(collaboratorsChannel);
        };
    }, [supabase, collaborators, setCollaborators, boardId, viewerId]);

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

            const insertCollaboratorPromise = supabase
                .from("profiles_boards_bridge")
                .insert({profile_id: profileData.id, board_id: boardId})

            const updateHasCollaboratorsPromise = supabase
                .from("boards")
                .update({has_collaborators: true})
                .eq("id", boardId)

            const [insertCollaboratorResponse, updateHasCollaboratorsResponse] = await Promise.all([insertCollaboratorPromise, updateHasCollaboratorsPromise]);

            if (insertCollaboratorResponse.error) throw insertCollaboratorResponse.error;
            if (updateHasCollaboratorsResponse.error) throw updateHasCollaboratorsResponse.error;

            return {
                toast: {
                    title: "Success!",
                    message: "User has been invited to collaborate on this board.",
                },
            }
        } catch {
            return {
                toast: {
                    title: "Something went wrong...",
                    message: "We could not invite this user. Please try again.",
                },
            }
        }
    }, [boardId, supabase])

    const removeCollaborator = useCallback(async (boardId: string, removedId: string) => {
        const removeCollaboratorPromise = supabase
            .from("profiles_boards_bridge")
            .delete()
            .match({ profile_id: removedId, board_id: boardId })

        const updateHasCollaboratorsPromise = supabase
            .from("boards")
            .update({has_collaborators: collaborators.length > 2})
            .eq("id", boardId)

        const [removeCollaboratorResponse, updateHasCollaboratorsResponse] = await Promise.all([removeCollaboratorPromise, updateHasCollaboratorsPromise]);

        if (removeCollaboratorResponse.error) throw removeCollaboratorResponse.error;
        if (updateHasCollaboratorsResponse.error) throw updateHasCollaboratorsResponse.error;
    }, [collaborators.length, supabase])

    const updateInvitePermissions = useCallback(async (boardId: string, profileId: string, previousInvitePermissions: boolean) => {
        const { error: grantPermissionsError } = await supabase
            .from("profiles_boards_bridge")
            .update({ has_invite_permissions: !previousInvitePermissions })
            .match({ profile_id: profileId, board_id: boardId });

        if (grantPermissionsError) throw grantPermissionsError;
    }, [supabase])

    return {collaborators, addCollaborator, removeCollaborator, updateInvitePermissions};
}
