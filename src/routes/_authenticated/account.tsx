import { createFileRoute } from "@tanstack/react-router";

import { DeleteAccountDialog } from "@/components/account/delete-account-dialog";
import ThemeDropdown from "@/components/account/theme-select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_authenticated/account")({
  component: Account,
});

function Account() {
  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between">
        <div className="space-y-1">
          <Label className="font-semibold" htmlFor="theme">
            Appearance
          </Label>
          <p className="text-sm">Customize how site looks on your device.</p>
        </div>
        <ThemeDropdown />
      </div>
      <Separator className="w-full" />
      <div className="w-full flex justify-between">
        <div className="space-y-1">
          <Label className="font-semibold" htmlFor="theme">
            Delete Account
          </Label>
          <p className="text-sm">Permanently delete the account and remove access from all boards.</p>
        </div>
        <DeleteAccountDialog />
      </div>
    </div>
  );
}
