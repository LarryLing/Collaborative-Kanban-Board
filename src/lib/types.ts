import { Tables } from "../../database.types";

export type UserProfile = Tables<"profiles"> & { socials: { url: string }[]; }
export type Board = Tables<"boards">;

export type OwnershipOptions = "me" | "not-me" | "";
export type SortOptions = "asc" | "des" | "";
export type ViewOptions = "list" | "";
