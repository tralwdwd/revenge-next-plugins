import { ImportTrackerModuleId } from "@revenge-mod/discord/common/import-tracker";
import { getModules, lookupModule } from "@revenge-mod/modules/finders";
import {
    withDependencies,
    withProps,
} from "@revenge-mod/modules/finders/filters";
import { instead } from "@revenge-mod/patcher";
import { lazy } from "@shared/lazy";
import type { PluginApi } from "@revenge-mod/plugins/types";
import type { Channel, Message, User } from "@vencord/discord-types";

type MessageActionSheetProps = {
    actionSheetSource?: string;
    canAddNewReactions: boolean;
    channel: Channel;
    message: Message;
    user: User;
};

const showLongPressMessageActionSheetModule = lazy(() => {
    const [module] = lookupModule(
        withProps<{
            showLongPressMessageActionSheet: (
                props: MessageActionSheetProps,
            ) => void;
        }>("showLongPressMessageActionSheet").and(
            withDependencies([
                withProps("openLazy"),
                null,
                null,
                ImportTrackerModuleId,
            ]),
        ),
    );

    if (module) return module;
});

export function patchSearchRowList({ cleanup, unscoped }: PluginApi) {
    const { ActionSheetPatcher } = unscoped.tralwdwdd;

    cleanup(
        getModules(withProps("SearchListRow"), (SearchListRowModule) => {
            cleanup(
                instead(
                    SearchListRowModule?.SearchListRow,
                    "type",
                    ([props], original) => {
                        const ret = original(props);

                        if (typeof props.label === "string") return ret;

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

        ActionSheetPatcher.registerPropsPatch<MessageActionSheetProps>(
            "MessageLongPressActionSheet",
            (config) => {
                if (config.actionSheetSource === "Preview") {
                    config.actionSheetSource = void 0;
                    config.canAddNewReactions = true;
                }
            },
        ),
    );
}
