import { ConstantsModuleId } from "@revenge-mod/discord/common/constants";
import { ImportTrackerModuleId } from "@revenge-mod/discord/common/import-tracker";
import { Stores } from "@revenge-mod/discord/flux";
import { lookupModule } from "@revenge-mod/modules/finders";
import {
    withDependencies,
    withProps,
} from "@revenge-mod/modules/finders/filters";
import { instead } from "@revenge-mod/patcher";
import {
    ReactJSXRuntimeModuleId,
    ReactModuleId,
    ReactNativeModuleId,
} from "@revenge-mod/react";
import type { UserStore } from "@vencord/discord-types";
import type { ToRevengeStore } from "@/types/util";

const { loose } = withDependencies;

export function patchSearchRowList() {
    const [SearchListRowModule] = lookupModule(
        withProps("SearchListRow").and(
            withDependencies(
                loose([
                    ReactModuleId,
                    ReactNativeModuleId,
                    loose([ConstantsModuleId]),
                    ReactJSXRuntimeModuleId,
                ]),
            ),
        ),
    );

    const [showLongPressMessageActionSheetModule] = lookupModule(
        withProps("showLongPressMessageActionSheet").and(
            withDependencies([
                withProps("openLazy", "hideActionSheet"),
                null,
                null,
                ImportTrackerModuleId,
            ]),
        ),
    );

    const UserStore = Stores.UserStore as ToRevengeStore<UserStore>;

    return instead(
        SearchListRowModule?.SearchListRow,
        "type",
        ([props], original) => {
            const ret = original(props);

            const { message, channel } = props.label.props;

            if (!message) return ret;

            const user = UserStore.getUser(message.author.id);

            const actionSheetConfig = {
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
    );
}
