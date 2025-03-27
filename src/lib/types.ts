import { Tables } from "../../database.types";

export type UserProfile = Tables<"profiles"> & { socials: { url: string }[]; }
export type Board = Tables<"boards">;

export type OwnershipOptions = "me" | "not-me" | "anyone";
export type SortOptions = "asc" | "des" | "last-opened";
export type ViewOptions = "list" | "gallery";
export type BookmarkedOptions = "true" | "false";

export type ColumnColorOptions = "text-primary" | "text-amber-900" | "text-orange-400" | "text-yellow-400" | "text-green-800" | "text-blue-500" | "text-purple-800" | "text-pink-400" | "text-red-600";
