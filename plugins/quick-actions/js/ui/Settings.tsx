import { Page, TableRowAssetIcon } from "@revenge-mod/components";
import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { Design } from "@revenge-mod/discord/design";
import { QuickActionId } from "../lib/actions";
import type { PluginSettingsComponent } from "@revenge-mod/plugins/types";
import type { QuickActionStorage } from "../types";

type Props = React.ComponentProps<
    PluginSettingsComponent<{ jsonStorage: QuickActionStorage }>
>;

export function SettingsComponent({ api }: Props) {
    const { actionConfigs } = api.jsonStorage.use()!;

    const createAction = () => {
        actionConfigs.push({
            title: "New Action",
            icon: "MagicWandIcon",
            arrow: false,
            action: QuickActionId.reloadApp,
        });

        api.jsonStorage.set({ actionConfigs });

        ActionSheetActionCreators.openLazy(
            import("./components/QuickActionSheet"),
            "quick-action-sheet",
            {
                api,
                index: actionConfigs.length - 1,
            },
        );
    };

    return (
        <Page>
            <Design.TableRowGroup title="Configured Actions">
                {actionConfigs.map((action, index) => (
                    <Design.TableRow
                        label={action.title}
                        icon={<TableRowAssetIcon name={action.icon} />}
                        arrow
                        onPress={() => {
                            ActionSheetActionCreators.openLazy(
                                import("./components/QuickActionSheet"),
                                "quick-action-sheet",
                                {
                                    api,
                                    index,
                                },
                            );
                        }}
                    />
                ))}
            </Design.TableRowGroup>
            <Design.Button
                text="New Action"
                variant="primary"
                size="md"
                onPress={createAction}
            />
        </Page>
    );
}
