import { getAssetIdByName } from "@revenge-mod/assets";
import {
    ActionSheetActionCreators,
    ToastActionCreators,
} from "@revenge-mod/discord/actions";
import { ConstantsModuleId } from "@revenge-mod/discord/common/constants";
import { ImportTrackerModuleId } from "@revenge-mod/discord/common/import-tracker";
import { LoggerModuleId } from "@revenge-mod/discord/common/logger";
import { Stores } from "@revenge-mod/discord/flux";
import { RootNavigationRef } from "@revenge-mod/discord/modules/main_tabs_v2";
import { lookupModule } from "@revenge-mod/modules/finders";
import {
    withDependencies,
    withProps,
} from "@revenge-mod/modules/finders/filters";
import { callNativeMethodSync } from "@revenge-mod/modules/native";
import { reloadApp } from "@revenge-mod/modules/native/app";
import { proxify } from "@revenge-mod/utils/proxy";
import { REVENGE_SERVER_ID, REVENGE_SUPPORT_CHANNEL_ID } from "./constants";
import type { GuildStore } from "@vencord/discord-types";
import type { ToRevengeStore } from "@/types/util";
import type { QuickAction } from "../types";

type ChannelRouter = {
    transitionToChannel(id: string): void;
};

type GuildRouter = {
    transitionTo(location: string): void;
};

const { relative } = withDependencies;

let ChannelRouter: ChannelRouter = proxify(() => {
    const [module] = lookupModule(
        withProps("transitionToChannel", "transitionToThread").and(
            withDependencies([
                withProps("getChannel", "hasChannel"),
                ConstantsModuleId,
                relative(1),
                relative(2),
                null,
                null,
                null,
                ImportTrackerModuleId,
            ]),
        ),
    );

    if (module) return (ChannelRouter = module);
}, {})!;

let GuildRouter: GuildRouter = proxify(() => {
    const [module] = lookupModule(
        withProps("transitionTo", "transitionToGuild").and(
            withDependencies([
                ConstantsModuleId,
                LoggerModuleId,
                relative(1),
                null,
                null,
                ImportTrackerModuleId,
            ]),
        ),
    );

    if (module) return (GuildRouter = module);
}, {})!;

const withHideActionSheet = (action: () => void) => {
    action();
    ActionSheetActionCreators.hideActionSheet();
};

export const quickActions = {
    reloadApp: {
        name: "Reload App",
        icon: "RetryIcon",
        action() {
            reloadApp();
        },
    },
    goToSettings: {
        name: "Go To Settings",
        icon: "SettingsIcon",
        action() {
            withHideActionSheet(() => {
                const navigation = RootNavigationRef.getRootNavigationRef();

                navigation.navigate("settings");
            });
        },
    },
    goToPlugins: {
        name: "Go To Plugins",
        icon: "PuzzlePieceIcon",
        action() {
            withHideActionSheet(() => {
                const navigation = RootNavigationRef.getRootNavigationRef();

                navigation.navigate("settings", {
                    screen: "Revenge Plugins",
                });
                ActionSheetActionCreators.hideActionSheet();
            });
        },
    },
    goToSupportChannel: {
        name: "Go To Support Channel",
        icon: "CircleQuestionIcon",
        action() {
            withHideActionSheet(() => {
                const GuildStore =
                    Stores.GuildStore as ToRevengeStore<GuildStore>;

                if (GuildStore.getGuild(REVENGE_SERVER_ID) == null) {
                    ToastActionCreators.open({
                        key: "not-in-revenge-server",
                        content: "You are not in the Revenge server!",
                        icon: getAssetIdByName("CircleXIcon"),
                    });

                    return;
                }

                ChannelRouter.transitionToChannel(REVENGE_SUPPORT_CHANNEL_ID);
            });
        },
    },
    goToDMs: {
        name: "Go To DMs",
        icon: "ChatIcon",
        action() {
            withHideActionSheet(() => GuildRouter.transitionTo("/@me"));
        },
    },
    goToAdvancedPluginSettings: {
        name: "Go To Advanced Plugin Settings",
        icon: "SettingsIcon",
        action() {
            withHideActionSheet(() => {
                const navigation = RootNavigationRef.getRootNavigationRef();

                navigation.navigate("settings", {
                    screen: "Revenge Plugins Advanced",
                });
            });
        },
    },
    enterRecoveryMode: {
        name: "Enter Recovery Mode",
        icon: "ShieldIcon",
        action() {
            callNativeMethodSync(
                // @ts-expect-error
                "revenge.plugins.states.requestNextBootDefaultsOnly",
                [],
            );
            reloadApp();
        },
    },
} as const satisfies Record<string, QuickAction>;

type QuickActionKey = keyof typeof quickActions;

export const QuickActionId = new Proxy(
    Object.fromEntries(Object.keys(quickActions).map((k) => [k, k])),
    {},
) as { [K in QuickActionKey]: K };
