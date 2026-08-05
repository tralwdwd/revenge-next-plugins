import { ConstantsModuleId } from "@revenge-mod/discord/common/constants";
import { ImportTrackerModuleId } from "@revenge-mod/discord/common/import-tracker";
import { lookupModule } from "@revenge-mod/modules/finders";
import {
    withDependencies,
    withProps,
} from "@revenge-mod/modules/finders/filters";
import { proxify } from "@revenge-mod/utils/proxy";

const { relative } = withDependencies;

type ChannelRouter = {
    transitionToChannel(id: string): void;
};

let ChannelRouter: ChannelRouter = proxify(() => {
    const [module] = lookupModule(
        withProps("transitionToChannel", "transitionToThread").and(
            withDependencies([
                withProps("getChannel", "hasChannel"),
                ConstantsModuleId,
                relative(1),
                relative(2),
                null,
                null,
                null,
                ImportTrackerModuleId,
            ]),
        ),
    );

    if (module) return (ChannelRouter = module);
}, {})!;

export function jumpToTop(details: {
    isDifferentChannel: boolean;
    channelId?: string;
    guildId?: string;
}) {
    const [MessageUtil] = lookupModule(
        withProps("jumpToMessage", "sendMessage"),
    );

    if (details.isDifferentChannel) {
        ChannelRouter?.transitionToChannel(details.channelId!);
    }

    MessageUtil?.jumpToMessage({
        channelId: details.channelId,
        messageId: details.channelId,
        flash: true,
        jumpType: "ANIMATED",
    });
}
