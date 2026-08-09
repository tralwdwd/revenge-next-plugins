import { TableRowAssetIcon } from "@revenge-mod/components";
import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { Design } from "@revenge-mod/discord/design";
import { lookupGeneratedIconComponent } from "@revenge-mod/utils/discord";
import { quickActions } from "../../lib/actions";
import type { QuickAction } from "../../types";

type ActionSelectionSheetProps = {
    selectedAction: keyof typeof quickActions;
    onValueChange: (key: keyof typeof quickActions) => void;
};

const CheckIcon = lookupGeneratedIconComponent("CheckmarkLargeIcon")!;

export default function ActionSelectionSheet({
    selectedAction,
    onValueChange,
}: ActionSelectionSheetProps) {
    const save = (value: keyof typeof quickActions) => {
        onValueChange(value);
        ActionSheetActionCreators.hideActionSheet();
    };

    return (
        <Design.ActionSheet>
            <Design.BottomSheetTitleHeader title="Select Action" />
            <Design.ActionSheetRow.Group>
                {(
                    Object.keys(quickActions) as Array<
                        keyof typeof quickActions
                    >
                ).map((key) => {
                    const action = quickActions[key] as QuickAction;

                    return (
                        <Design.ActionSheetRow
                            label={action.name}
                            icon={<TableRowAssetIcon name={action.icon} />}
                            trailing={
                                key === selectedAction ? <CheckIcon /> : null
                            }
                            onPress={() => save(key)}
                        />
                    );
                })}
            </Design.ActionSheetRow.Group>
        </Design.ActionSheet>
    );
}
