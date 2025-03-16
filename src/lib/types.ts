import { Tables } from "../../database.types";

export type UserProfile = Tables<"profiles"> & { socials: { url: string }[]; }
export type Board = Tables<"boards">;
