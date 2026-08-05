import { ImportTrackerModuleId } from "@revenge-mod/discord/common/import-tracker";
import { getModules, lookupModule } from "@revenge-mod/modules/finders";
import {
    withDependencies,
    withProps,
} from "@revenge-mod/modules/finders/filters";
import { before, instead } from "@revenge-mod/patcher";
import { ReactJSXRuntimeModuleId, ReactModuleId } from "@revenge-mod/react";
import type { PluginCleanupApi } from "@revenge-mod/plugins/types";
import type { Channel, Message, User } from "@vencord/discord-types";

type MessageActionSheetProps = {
    actionSheetSource?: string;
    canAddNewReactions: boolean;
    channel: Channel;
    message: Message;
    user: User;
};

let showLongPressMessageActionSheet: (props: MessageActionSheetProps) => void;
const { loose, relative } = withDependencies;

const [showLongPressMessageActionSheetModule] = lookupModule(
    withProps<{
        showLongPressMessageActionSheet: typeof showLongPressMessageActionSheet;
    }>("showLongPressMessageActionSheet").and(
        withDependencies([
            loose([
                null,
                ReactModuleId,
                ReactJSXRuntimeModuleId,
                null,
                relative(1),
                relative(2),
            ]),
            null,
            null,
            ImportTrackerModuleId,
        ]),
    ),
);

export function patchSearchRowList(cleanup: PluginCleanupApi) {
    cleanup(
        getModules(withProps("SearchListRow"), (SearchListRowModule) => {
            cleanup(
                instead(
                    SearchListRowModule?.SearchListRow,
                    "type",
                    ([props], original) => {
                        const ret = original(props);

                        const { message, channel } = props.label.props as {
                            message: Message;
                            channel: Channel;
                        };

                        if (!message) return ret;

                        const user = message.author;

                        const actionSheetConfig: MessageActionSheetProps = {
                            canAddNewReactions: true,
                            channel,
                            message,
                            user,
                        };

                        ret.props.onLongPress = () => {
                            showLongPressMessageActionSheetModule?.showLongPressMessageActionSheet(
                                actionSheetConfig,
                            );
                        };

                        return ret;
                    },
                ),
            );
        }),

        before(
            showLongPressMessageActionSheetModule!,
            "showLongPressMessageActionSheet",
            (args) => {
                const [config] = args;
                if (config.actionSheetSource === "Preview") {
                    config.actionSheetSource = void 0;
                    config.canAddNewReactions = true;
                }

                return args;
            },
        ),
    );
}
