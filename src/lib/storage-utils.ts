import { BookmarkedOptions, OwnershipOptions, SortOptions, ViewOptions } from "@/lib/types";

export const ownership = {
	getSnapshot: () => sessionStorage.getItem("ownership") as OwnershipOptions,
	subscribe: (listener: () => void) => {
		window.addEventListener("storage", listener);
		return () => void window.removeEventListener("storage", listener);
	},
};

if (!ownership.getSnapshot()) {
	sessionStorage.setItem("ownership", "anyone" satisfies OwnershipOptions);
}

export function handleOwnershipChange(value: OwnershipOptions) {
    window.sessionStorage.setItem("ownership", value);
    window.dispatchEvent(
        new StorageEvent("storage", { key: "ownership", newValue: value }),
    );
}

export const sort = {
	getSnapshot: () => sessionStorage.getItem("sort") as SortOptions,
	subscribe: (listener: () => void) => {
		window.addEventListener("storage", listener);
		return () => void window.removeEventListener("storage", listener);
	},
};

if (!sort.getSnapshot()) {
	sessionStorage.setItem("sort", "last-opened" satisfies SortOptions);
}

export function handleSortChange(value: SortOptions) {
    window.sessionStorage.setItem("sort", value);
    window.dispatchEvent(
        new StorageEvent("storage", { key: "sort", newValue: value }),
    );
}

export const view = {
	getSnapshot: () => sessionStorage.getItem("view") as ViewOptions,
	subscribe: (listener: () => void) => {
		window.addEventListener("storage", listener);
		return () => void window.removeEventListener("storage", listener);
	},
};

if (!view.getSnapshot()) {
	sessionStorage.setItem("view", "gallery" satisfies ViewOptions);
}

export function handleViewChange(value: ViewOptions) {
    window.sessionStorage.setItem("view", value);
    window.dispatchEvent(
        new StorageEvent("storage", { key: "view", newValue: value }),
    );
}

export const bookmarked = {
	getSnapshot: () => sessionStorage.getItem("bookmarked") as BookmarkedOptions,
	subscribe: (listener: () => void) => {
		window.addEventListener("storage", listener);
		return () => void window.removeEventListener("storage", listener);
	},
};

if (!bookmarked.getSnapshot()) {
	sessionStorage.setItem("bookmarked", "false" satisfies BookmarkedOptions);
}

export function handleBookmarkedChange(value: BookmarkedOptions) {
    window.sessionStorage.setItem("bookmarked", value);
    window.dispatchEvent(
        new StorageEvent("storage", { key: "bookmarked", newValue: value }),
    );
}
