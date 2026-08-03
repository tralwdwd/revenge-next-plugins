import { lookupModule } from "@revenge-mod/modules/finders";
import { withProps } from "@revenge-mod/modules/finders/filters";

export function jumpToTop(details: {
    isDifferentChannel: boolean;
    channelId?: string;
    guildId?: string;
}) {
    const [ChannelRouter] = lookupModule(
        withProps("transitionToChannel", "transitionToThread"),
    );
    const [MessageUtil] = lookupModule(
        withProps("jumpToMessage", "sendMessage"),
    );

    if (details.isDifferentChannel) {
        ChannelRouter?.transitionToChannel(details.channelId);
    }

    MessageUtil?.jumpToMessage({
        channelId: details.channelId,
        messageId: details.channelId,
        flash: true,
        jumpType: "ANIMATED",
    });
}
