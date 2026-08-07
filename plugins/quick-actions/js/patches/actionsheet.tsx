import { TableRowAssetIcon } from "@revenge-mod/components";
import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { Design } from "@revenge-mod/discord/design";
import { RootNavigationRef } from "@revenge-mod/discord/modules/main_tabs_v2";
import { reloadApp } from "@revenge-mod/modules/native/app";
import type { PluginCleanupApi } from "@revenge-mod/plugins/types";

export function patchActionSheet(cleanup: PluginCleanupApi) {
    const ActionSheetPatcher = window.tralwdwdd.ActionSheetPatcher;

    cleanup(
        ActionSheetPatcher.registerActionSheetPatch(
            "you-account-action-sheet-key",
            (tree) => {
                const navigation = RootNavigationRef.getRootNavigationRef();

                tree.unshift(
                    <Design.ActionSheetRow.Group title="Revenge Quick Actions">
                        <Design.ActionSheetRow
                            label="Reload App"
                            icon={<TableRowAssetIcon name="RetryIcon" />}
                            onPress={() => reloadApp()}
                        />
                        <Design.ActionSheetRow
                            label="Settings"
                            icon={<TableRowAssetIcon name="SettingsIcon" />}
                            onPress={() => {
                                navigation.navigate("settings");
                                ActionSheetActionCreators.hideActionSheet();
                            }}
                        />
                        <Design.ActionSheetRow
                            label="Plugins"
                            icon={<TableRowAssetIcon name="PuzzlePieceIcon" />}
                            onPress={() => {
                                navigation.navigate("settings", {
                                    screen: "Revenge Plugins",
                                });
                                ActionSheetActionCreators.hideActionSheet();
                            }}
                        />
                    </Design.ActionSheetRow.Group>,
                );
            },
        ),
    );
}
