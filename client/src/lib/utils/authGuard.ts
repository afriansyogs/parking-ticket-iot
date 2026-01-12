import { goto } from "$app/navigation";
import { tokenUser } from "$lib/state/token.svelte";

export function authGuard(): void {
  if (!tokenUser.token) {
    goto("/login");
  }
}
