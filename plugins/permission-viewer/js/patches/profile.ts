import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { getModules } from "@revenge-mod/modules/finders";
import { withName } from "@revenge-mod/modules/finders/filters";
import { instead } from "@revenge-mod/patcher";
import { findInReactFiber } from "@revenge-mod/utils/react";
import type { DiscordModules } from "@revenge-mod/discord/types";
import type { PluginApi } from "@revenge-mod/plugins/types";
import type { Channel, User } from "@vencord/discord-types";

type UserProfileOverflowMenu = React.FC<{
	user: User;
	displayProfile?: {
		guildId: string;
	};
	channel: Channel;
}>;

type ContextMenuResult = React.ReactElement<DiscordModules.Components.ContextMenuProps>;

export function patchUserProfileMenu({ cleanup }: PluginApi) {
	cleanup(
		getModules(
			withName<UserProfileOverflowMenu>("UserProfileOverflowMenu"),
			UserProfileOverflowMenuModule => {
				const module = UserProfileOverflowMenuModule as {
					default: UserProfileOverflowMenu;
				};

				cleanup(
					instead(module, "default", ([props], Component) => {
						const { user } = props;
						const guildId =
							props.displayProfile?.guildId ?? props.channel.guild_id;

						const result = Component(props) as React.ReactElement;

						const menu = findInReactFiber(
							result,
							node => node?.props?.items,
						)! as ContextMenuResult;
						const items = menu.props.items[0] as DiscordModules.Components.ContextMenuItem[];

						items.push({
							label: "User Permissions",
							action() {
								ActionSheetActionCreators.openLazy(
									import("../ui/sheets/UserPermissionsSheet"),
									`user-permissions-${user.id}`,
									{ user, guildId },
								);
							},
						});

						return result;
					}),
				);
			},
			{
				returnNamespace: true,
			},
		),
	);
}
