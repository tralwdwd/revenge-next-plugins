import { TableRowAssetIcon } from "@revenge-mod/components";
import { Design } from "@revenge-mod/discord/design";
import { quickActions } from "../lib/actions";
import type { PluginApi } from "@revenge-mod/plugins/types";
import type { QuickActionStorage } from "../types";

export function patchActionSheet({
    jsonStorage,
    cleanup,
}: PluginApi<{ jsonStorage: QuickActionStorage }>) {
    const ActionSheetPatcher = window.tralwdwdd.ActionSheetPatcher;

    cleanup(
        ActionSheetPatcher.registerActionSheetPatch(
            "you-account-action-sheet-key",
            (tree) => {
                const { actionConfigs } = jsonStorage.use()!;

                if (actionConfigs.length === 0) return;

                tree.unshift(
                    <Design.ActionSheetRow.Group title="Quick Actions">
                        {actionConfigs.map((config) => (
                            <Design.ActionSheetRow
                                label={config.title}
                                icon={<TableRowAssetIcon name={config.icon} />}
                                arrow={config.arrow}
                                onPress={quickActions[config.action].action}
                            />
                        ))}
                    </Design.ActionSheetRow.Group>,
                );
            },
        ),
    );
}
