import { getAssetIdByName } from "@revenge-mod/assets";
import {
    ActionSheetActionCreators,
    ToastActionCreators,
} from "@revenge-mod/discord/actions";
import { Stores } from "@revenge-mod/discord/flux";
import { RootNavigationRef } from "@revenge-mod/discord/modules/main_tabs_v2";
import { callNativeMethodSync } from "@revenge-mod/modules/native";
import { reloadApp } from "@revenge-mod/modules/native/app";
import { ChannelRouter, GuildRouter } from "@shared/modules/misc";
import { REVENGE_SERVER_ID, REVENGE_SUPPORT_CHANNEL_ID } from "./constants";
import type { GuildStore } from "@vencord/discord-types";
import type { ToRevengeStore } from "@/types/util";
import type { QuickAction } from "../types";

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
				const GuildStore = Stores.GuildStore as ToRevengeStore<GuildStore>;

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
	Object.fromEntries(Object.keys(quickActions).map(k => [k, k])),
	{},
) as { [K in QuickActionKey]: K };
