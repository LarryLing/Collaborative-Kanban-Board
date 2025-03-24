import { Tables } from "../../database.types";

export type UserProfile = Tables<"profiles"> & { socials: { url: string }[]; }
export type Board = Tables<"boards">;
// export type Column = Tables<"columns">

export type OwnershipOptions = "me" | "not-me" | "anyone";
export type SortOptions = "asc" | "des" | "last-opened";
export type ViewOptions = "list" | "gallery";
export type BookmarkedOptions = "true" | "false";
