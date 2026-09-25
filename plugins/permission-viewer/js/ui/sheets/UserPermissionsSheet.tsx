import { Design } from "@revenge-mod/discord/design";
import { Stores } from "@revenge-mod/discord/flux";
import { ReactNative } from "@revenge-mod/react";
import { RoleItem, VoidAvatar } from "@shared/modules/ui";
import { BigFlagUtils, PermissionUtils } from "@shared/modules/utils";
import { PermissionRow } from "../components/PermissionRow";
import type { BigFlags } from "@shared/modules/utils";
import type {
    GuildMemberStore,
    GuildRoleStore,
    Role,
    User,
} from "@vencord/discord-types";
import type { ToRevengeStore } from "@/types/util";

function combinePermissions(roles: Role[]): BigFlags {
	let combined = 0n;

	roles.forEach(role => role && (combined |= role.permissions));

	return combined;
}

type PermissionsResult = {
	name: string;
	has: boolean;
}[];

function resolvePermissions(roles: Role[]): PermissionsResult {
	const combined = combinePermissions(roles);

	const permissions = PermissionUtils.OrderedPermissions;

	return permissions.map((permission) => ({
        name: PermissionUtils.getPermissionName(permission),
        has: BigFlagUtils.has(combined, permission),
    }));
}

export default function UserPermissionsSheet({
	user,
	guildId,
}: {
	user: User;
	guildId: string;
}) {
	const GuildRoleStore =
		Stores.GuildRoleStore as ToRevengeStore<GuildRoleStore>;
	const GuildMemberStore =
		Stores.GuildMemberStore as ToRevengeStore<GuildMemberStore>;

	const member = GuildMemberStore.getMember(guildId, user.id)!;
	const name = member.nick ?? user.globalName ?? user.username;

	const roleIds = member.roles;
    roleIds.push(guildId);
	const roles = roleIds.map(id => GuildRoleStore.getRole(guildId, id));

	const permissions = resolvePermissions(roles);

	return (
		<Design.ActionSheet>
			<Design.BottomSheetTitleHeader
				leading={<VoidAvatar user={user} guildId={guildId} size="small" />}
				title={name}
			/>
			<ReactNative.View style={styles.roleContainer}>
				{roles.map(role => (
					<RoleItem role={role} guildId={guildId} />
				))}
			</ReactNative.View>

			<Design.ActionSheetRow.Group>
				{permissions.map(permission => (
					<PermissionRow label={permission.name} enabled={permission.has} />
				))}
			</Design.ActionSheetRow.Group>
		</Design.ActionSheet>
	);
}

const styles = ReactNative.StyleSheet.create({
	roleContainer: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
});
