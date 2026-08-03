import type { DiscordModules } from "@revenge-mod/discord/types";
import type { FluxStore } from "@vencord/discord-types";

export type ToRevengeStore<T extends FluxStore> = DiscordModules.Flux.Store<
    Omit<T, keyof FluxStore>
>;
