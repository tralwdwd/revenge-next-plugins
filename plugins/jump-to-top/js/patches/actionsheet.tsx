import { getAssetIdByName } from "@revenge-mod/assets";
import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { Design } from "@revenge-mod/discord/design";
import { Stores } from "@revenge-mod/discord/flux";
import { ChannelType } from "@vencord/discord-types/enums";
import { UpsideDown } from "../ui/components/UpsideDown";
import { jumpToTop } from "../utils";
import type { PluginApi } from "@revenge-mod/plugins/types";
import type { Channel, ChannelStore } from "@vencord/discord-types";
import type { ToRevengeStore } from "@/types/util";

type ChannelLongPressProps = {
    channelId: string;
};

type ForumPostLongPressProps = {
    thread: Channel;
};

const allowedChannelTypes = [
    ChannelType.GUILD_TEXT,
    ChannelType.DM,
    ChannelType.GUILD_VOICE,
    ChannelType.GROUP_DM,
    ChannelType.GUILD_ANNOUNCEMENT,
    ChannelType.GUILD_STORE,
    ChannelType.ANNOUNCEMENT_THREAD,
    ChannelType.PUBLIC_THREAD,
    ChannelType.PRIVATE_THREAD,
];

export function patchActionSheet({ cleanup }: PluginApi) {
    const ActionSheetPatcher = window.tralwdwdd.ActionSheetPatcher;

    cleanup(
        ActionSheetPatcher.registerActionSheetPatch<ChannelLongPressProps>(
            /^ChannelLongPress/,
            (tree, props) => {
                const ChannelStore =
                    Stores.ChannelStore as ToRevengeStore<ChannelStore>;

                const { id: channelId, type } = ChannelStore.getChannel(
                    props.channelId,
                );

                if (!allowedChannelTypes.includes(type)) return;

                tree.unshift(
                    <Design.ActionSheetRow.Group>
                        <Design.ActionSheetRow
                            label="Jump To Top"
                            icon={
                                <UpsideDown>
                                    <Design.ActionSheetRow.Icon
                                        source={
                                            getAssetIdByName(
                                                "ArrowLargeDownIcon",
                                            )!
                                        }
                                    />
                                </UpsideDown>
                            }
                            onPress={() => {
                                jumpToTop({
                                    isDifferentChannel: true,
                                    channelId,
                                });

                                ActionSheetActionCreators.hideActionSheet();
                            }}
                        />
                    </Design.ActionSheetRow.Group>,
                );
            },
        ),
        ActionSheetPatcher.registerActionSheetPatch<ForumPostLongPressProps>(
            "ForumPostLongPressActionSheet",
            (tree, props) => {
                const { guild_id: guildId, id: threadId } = props.thread;

                tree.unshift(
                    <Design.ActionSheetRow.Group>
                        <Design.ActionSheetRow
                            label="Jump To Top"
                            icon={
                                <UpsideDown>
                                    <Design.ActionSheetRow.Icon
                                        source={
                                            getAssetIdByName(
                                                "ArrowLargeDownIcon",
                                            )!
                                        }
                                    />
                                </UpsideDown>
                            }
                            onPress={() => {
                                jumpToTop({
                                    isDifferentChannel: false,
                                    channelId: threadId,
                                    guildId,
                                });

                                ActionSheetActionCreators.hideActionSheet();
                            }}
                        />
                    </Design.ActionSheetRow.Group>,
                );
            },
        ),
        ActionSheetPatcher.registerActionSheetPatch<ChannelLongPressProps>(
            "ThreadLongPressActionSheet",
            (tree, props) => {
                const ChannelStore =
                    Stores.ChannelStore as ToRevengeStore<ChannelStore>;

                const { id: channelId, type } = ChannelStore.getChannel(
                    props.channelId,
                );

                if (!allowedChannelTypes.includes(type)) return;

                tree.unshift(
                    <Design.ActionSheetRow.Group>
                        <Design.ActionSheetRow
                            label="Jump To Top"
                            icon={
                                <UpsideDown>
                                    <Design.ActionSheetRow.Icon
                                        source={
                                            getAssetIdByName(
                                                "ArrowLargeDownIcon",
                                            )!
                                        }
                                    />
                                </UpsideDown>
                            }
                            onPress={() => {
                                jumpToTop({
                                    isDifferentChannel: true,
                                    channelId,
                                });

                                ActionSheetActionCreators.hideActionSheet();
                            }}
                        />
                    </Design.ActionSheetRow.Group>,
                );
            },
        ),
    );
}
