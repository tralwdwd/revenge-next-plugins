import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { Design } from "@revenge-mod/discord/design";
import { Stores } from "@revenge-mod/discord/flux";
import { UserActionCreators } from "@shared/modules/actions";
import { VoidAvatar } from "@shared/modules/ui";
import { FluxUtils } from "@shared/modules/utils";
import { PermissionOverwriteType } from "@vencord/discord-types/enums";
import type {
    ChannelStore,
    GuildMemberStore,
    GuildRoleStore,
    PermissionOverwrite,
    User,
    UserStore,
} from "@vencord/discord-types";
import type { ToRevengeStore } from "@/types/util";

type MemberOverwriteResult = {
	user?: User;
	overwrite: PermissionOverwrite;
	name: string;
};

export default function ChannelOverwritesSheet({
	channelId,
}: {
	channelId: string;
}) {
	const ChannelStore = Stores.ChannelStore as ToRevengeStore<ChannelStore>;
	const GuildRoleStore =
		Stores.GuildRoleStore as ToRevengeStore<GuildRoleStore>;
	const GuildMemberStore =
		Stores.GuildMemberStore as ToRevengeStore<GuildMemberStore>;
	const UserStore = Stores.UserStore as ToRevengeStore<UserStore>;

	const channel = ChannelStore.getChannel(channelId);
	const { guild_id: guildId } = channel;

	const channelRoles = GuildRoleStore.getSortedRoles(guildId);
	const roleById = Object.fromEntries(
		channelRoles.map(role => [role.id, role]),
	);

	const overwrites = Object.values(channel.permissionOverwrites);
	const roleOverwrites = overwrites.filter(
		overwrite => overwrite.type === PermissionOverwriteType.ROLE,
	);
	const memberOverwrites = overwrites.filter(
		overwrite => overwrite.type === PermissionOverwriteType.MEMBER,
	);

	const users = FluxUtils.useStateFromStoresArray<MemberOverwriteResult>(
		[UserStore, GuildMemberStore],
		() => {
			memberOverwrites.forEach(overwrite =>
				UserActionCreators.getUser(overwrite.id),
			);

			return memberOverwrites.flatMap(overwrite => {
				const user = UserStore.getUser(overwrite.id);
				const member = GuildMemberStore.getMember(guildId, overwrite.id);

				if (!user) return [];

				return [
					{
						user,
						overwrite,
						get name() {
							return member?.nick ?? user.globalName ?? user.username;
						},
					},
				];
			});
		},
	);

	return (
		<Design.ActionSheet>
			<Design.BottomSheetTitleHeader
				title={`Permission Overwrites for ${channel.name}`}
			/>

			{overwrites.length === 0 && (
				<Design.ActionSheetRow.Group>
					<Design.ActionSheetRow
						label="No permission overwrites"
						subLabel="This channel uses this server's default permissions."
					/>
				</Design.ActionSheetRow.Group>
			)}

			{roleOverwrites.length > 0 && (
				<Design.ActionSheetRow.Group title="Role Overwrites">
					{roleOverwrites.map(overwrite => {
						const role = roleById[overwrite.id];

						return (
							<Design.ActionSheetRow
								label={role.name}
								onPress={() => {
									ActionSheetActionCreators.openLazy(
										import("./RoleOverwritesSheet"),
										`role-overwrites-${role.id}`,
										{ role, overwrite },
										"stack",
									);
								}}
							/>
						);
					})}
				</Design.ActionSheetRow.Group>
			)}
			{memberOverwrites.length > 0 && (
				<Design.ActionSheetRow.Group title="Member Overwrites">
					{users.map(result => {
						if (!result.user) return;

						const { user, overwrite, name } = result;

						return (
							<Design.ActionSheetRow
								icon={<VoidAvatar user={user} guildId={guildId} size="small" />}
								label={name}
								onPress={() => {
									ActionSheetActionCreators.openLazy(
										import("./MemberOverwritesSheet"),
										`member-overwrites-${user.id}`,
										{ overwrite, name },
										"stack",
									);
								}}
							/>
						);
					})}
					{users.length < memberOverwrites.length && (
						<Design.ActionSheetRow label="Loading members..." />
					)}
				</Design.ActionSheetRow.Group>
			)}
		</Design.ActionSheet>
	);
}
