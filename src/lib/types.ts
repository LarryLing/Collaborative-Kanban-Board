import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "../../database.types";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type UserProfile = {
    id: string;
    display_name: string;
    email: string;
    about_me: string;
    avatar_url: string;
    socials: {
        url: string
    }[]
}

export type BoardMember = {
    member_id: string;
    is_owner: boolean;
    has_invite_permissions: boolean;
}

export type Board = Tables<"boards"> & {
    bookmarked: boolean;
}

export type Card = {
    id: string;
    column_id: string;
    title: string;
    description: string;
    created_at: string;
}

export type Column = {
    id: string;
    title: string;
    color: ColumnColorOptions;
}

export type Collaborator = {
    profile_id: string;
    display_name: string;
    email: string;
    avatar_url: string;
    has_invite_permissions: boolean;
}

export type OwnershipOptions = "me" | "not-me" | "anyone";
export type SortOptions = "asc" | "des" | "last-opened";
export type ViewOptions = "list" | "gallery";
export type BookmarkedOptions = "true" | "false";

export type ColumnColorOptions = "text-primary" | "text-amber-900" | "text-orange-400" | "text-yellow-400" | "text-green-800" | "text-blue-500" | "text-purple-800" | "text-pink-400" | "text-red-600";
