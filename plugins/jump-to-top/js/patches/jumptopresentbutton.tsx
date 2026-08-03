import { getAssetIdByName } from "@revenge-mod/assets";
import { Design } from "@revenge-mod/discord/design";
import { Stores } from "@revenge-mod/discord/flux";
import { getModules } from "@revenge-mod/modules/finders";
import { withName } from "@revenge-mod/modules/finders/filters";
import { instead } from "@revenge-mod/patcher";
import { ChannelType } from "@vencord/discord-types/enums";
import { JumpToTopButton } from "../ui/components/JumpToTopButton";
import type { PluginApi, PluginCleanupApi } from "@revenge-mod/plugins/types";
import type { ChannelStore } from "@vencord/discord-types";
import type { ToRevengeStore } from "@/types/util";

export function patchJumpToPresent({ cleanup }: PluginApi) {
    cleanup(
        getModules(
            withName("JumpToPresentButton"),
            (JTPButton) => patch(JTPButton, cleanup),
            {
                returnNamespace: true,
            },
        ),
    );
}

function patch(JTPButton: any, cleanup: PluginCleanupApi) {
    const ChannelStore = Stores.ChannelStore as ToRevengeStore<ChannelStore>;

    cleanup(
        instead(JTPButton, "default", ([props], original) => {
            const ret = original(
                props,
            ) as React.ReactElement<React.PropsWithChildren>;

            if (ret == null) return null;

            const JumpToPresentButton = ret.props
                .children as React.ReactElement;

            if (!isJumpToPresentButton(JumpToPresentButton)) return ret;

            const { type: channelType } = ChannelStore.getChannel(
                props.channelId,
            );

            // Voice channel text counts as different channel
            const isNotCurrentChannel = channelType === ChannelType.GUILD_VOICE;

            ret.props.children = (
                <Design.Stack>
                    <JumpToTopButton
                        JumpToPresentButton={JumpToPresentButton}
                        channelId={props.channelId}
                        isDifferentChannel={isNotCurrentChannel}
                    />
                    {JumpToPresentButton}
                </Design.Stack>
            );

            return ret;
        }),
    );
}

function isJumpToPresentButton(button: React.ReactElement) {
    const ArrowIconId = getAssetIdByName("ArrowLargeDownIcon");

    // @ts-expect-error
    return button.props?.icon === ArrowIconId;
}
