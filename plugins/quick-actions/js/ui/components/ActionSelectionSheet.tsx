import { TableRowAssetIcon } from "@revenge-mod/components";
import { Design } from "@revenge-mod/discord/design";
import { quickActions } from "../../lib/actions";
import type { QuickAction } from "../../types";

type ActionSelectionSheetProps = {
    selectedAction: keyof typeof quickActions;
    onValueChange: (key: keyof typeof quickActions) => void;
};

export default function ActionSelectionSheet({
    selectedAction,
    onValueChange,
}: ActionSelectionSheetProps) {
    return (
        <Design.ActionSheet>
            <Design.BottomSheetTitleHeader title="Select Action" />
            <Design.TableRadioGroup
                defaultValue={selectedAction}
                onChange={onValueChange}
            >
                {(
                    Object.keys(quickActions) as Array<
                        keyof typeof quickActions
                    >
                ).map((key) => {
                    const action = quickActions[key] as QuickAction;

                    return (
                        <Design.TableRadioRow
                            label={action.name}
                            icon={<TableRowAssetIcon name={action.icon} />}
                            value={key}
                        />
                    );
                })}
            </Design.TableRadioGroup>
        </Design.ActionSheet>
    );
}
