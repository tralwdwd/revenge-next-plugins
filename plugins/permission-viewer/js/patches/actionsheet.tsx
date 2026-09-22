import { TableRowAssetIcon } from "@revenge-mod/components";
import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { Design } from "@revenge-mod/discord/design";
import { findInReactFiber } from "@revenge-mod/utils/react";
import type { PluginApi } from "@revenge-mod/plugins/types";
import type { Guild } from "@vencord/discord-types";

type GuildActionSheetProps = {
	guild: Guild;
};

type ChannelLongPressProps = {
	channelId: string;
};

type ReactPropsWithChildrenArray = {
	children: React.ReactElement[];
};

export function patchActionSheet({ cleanup, unscoped }: PluginApi) {
	const { ActionSheetPatcher } = unscoped.tralwdwdd;

	cleanup(
		ActionSheetPatcher.registerActionSheetPatch<GuildActionSheetProps>(
			/^GuildActionSheet/,
			(tree, props) => {
				const { guild } = props;

				tree.unshift(
					<Design.ActionSheetRow.Group>
						<Design.ActionSheetRow
							label="Server Roles"
							onPress={() => {
								ActionSheetActionCreators.openLazy(
									import("../ui/sheets/ServerRolesSheet"),
									`guild-roles-${guild.id}`,
									{ guild },
									"stack",
								);
							}}
						/>
					</Design.ActionSheetRow.Group>,
				);
			},
			{
				findActionGroups(element) {
					return (
						findInReactFiber(
							element,
							node =>
								node?.type?.displayName === "View" && node?.props?.children,
						) as React.ReactElement<ReactPropsWithChildrenArray> | undefined
					)?.props?.children;
				},
			},
		),
		ActionSheetPatcher.registerActionSheetPatch<ChannelLongPressProps>(
			/^ChannelLongPress/,
			(tree, props) => {
                const { channelId } = props;

				tree.unshift(
                    <Design.ActionSheetRow.Group>
                        <Design.ActionSheetRow
                            label="Channel Permissions"
                            icon={<TableRowAssetIcon name="ShieldIcon" />}
                            onPress={() => {
                                ActionSheetActionCreators.openLazy(
                                    import("../ui/sheets/channel/ChannelOverwritesSheet"),
                                    `channel-overwrites-${channelId}`,
                                    { channelId },
                                    "stack",
                                );
                            }}
                        />
                    </Design.ActionSheetRow.Group>,
                );
			},
		),
	);
}
