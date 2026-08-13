import { TableRowAssetIcon } from "@revenge-mod/components";
import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { Design } from "@revenge-mod/discord/design";
import { React } from "@revenge-mod/react";
import { quickActions } from "../../lib/actions";
import { useDebouncedValue } from "../../lib/utils";
import { InputRow } from "./InputRow";
import type { PluginApi } from "@revenge-mod/plugins/types";
import type { QuickActionConfig, QuickActionStorage } from "../../types";

type Props = {
    api: PluginApi<{ jsonStorage: QuickActionStorage }>;
    index: number;
};

export default function QuickActionSheet({ api, index }: Props) {
    const { actionConfigs } = api.jsonStorage.use()!;
    const config = actionConfigs[index];

    const [title, setTitle] = React.useState(config?.title);
    const debouncedTitle = useDebouncedValue(title, 500);

    React.useEffect(() => {
        if (title !== config?.title) {
            updateAction("title", debouncedTitle);
        }
    }, [debouncedTitle]);

    const [icon, setIcon] = React.useState(config?.icon);
    const debouncedIcon = useDebouncedValue(icon, 500);

    React.useEffect(() => {
        if (debouncedIcon !== config?.icon) {
            updateAction("icon", debouncedIcon);
        }
    }, [debouncedIcon]);

    if (!config)
        return (
            <Design.ActionSheet>
                <Design.BottomSheetTitleHeader title="Deleted" />
            </Design.ActionSheet>
        );

    const save = () => api.jsonStorage.set({ actionConfigs });
    const updateAction = <P extends keyof QuickActionConfig>(
        prop: P,
        value: QuickActionConfig[P],
    ) => {
        config[prop] = value;
        save();
    };

    const deleteAction = () => {
        ActionSheetActionCreators.hideActionSheet();
        actionConfigs.splice(index, 1);
        save();
    };

    return (
        <Design.ActionSheet>
            <Design.BottomSheetTitleHeader title="Edit Action Configuration" />
            <Design.ActionSheetRow.Group>
                <InputRow label="Title" value={title} onChange={setTitle} />
                <InputRow
                    label="Icon"
                    trailingIcon={() => (
                        <TableRowAssetIcon name={config.icon} />
                    )}
                    value={icon}
                    onChange={setIcon}
                />
                <Design.ActionSheetSwitchRow
                    label="Arrow"
                    value={config.arrow}
                    onValueChange={(s) => updateAction("arrow", s)}
                />
                <Design.ActionSheetRow
                    label="Action"
                    subLabel={quickActions[config.action].name}
                    onPress={() => {
                        ActionSheetActionCreators.openLazy(
                            import("./ActionSelectionSheet"),
                            "select-action",
                            {
                                selectedAction: config.action,
                                onValueChange(key) {
                                    updateAction("action", key);
                                },
                            },
                            "stack",
                        );
                    }}
                />
            </Design.ActionSheetRow.Group>

            <Design.ActionSheetRow.Group>
                <Design.ActionSheetRow
                    variant="danger"
                    label="Delete Action"
                    icon={
                        <TableRowAssetIcon name="TrashIcon" variant="danger" />
                    }
                    onPress={deleteAction}
                />
            </Design.ActionSheetRow.Group>
        </Design.ActionSheet>
    );
}
