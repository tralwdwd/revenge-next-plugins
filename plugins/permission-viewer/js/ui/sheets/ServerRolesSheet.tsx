import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { Design } from "@revenge-mod/discord/design";
import { Stores } from "@revenge-mod/discord/flux";
import type { Guild, GuildRoleStore } from "@vencord/discord-types";
import type { ToRevengeStore } from "@/types/util";

export default function ServerRolesSheet({ guild }: { guild: Guild }) {
	const GuildRoleStore =
		Stores.GuildRoleStore as ToRevengeStore<GuildRoleStore>;
	const roles = GuildRoleStore.getSortedRoles(guild.id);

	return (
		<Design.ActionSheet>
			<Design.BottomSheetTitleHeader title={`Roles for ${guild.name}`} />

			<Design.ActionSheetRow.Group>
				{roles.map(role => (
					<Design.ActionSheetRow
						label={role.name}
						onPress={() =>
							ActionSheetActionCreators.openLazy(
								import("./RolePermissionsSheet"),
								`role-permissions-${role.id}`,
								{ role },
								"stack",
							)
						}
					/>
				))}
			</Design.ActionSheetRow.Group>
		</Design.ActionSheet>
	);
}
