import { Constants } from "@revenge-mod/discord/common/constants";
import { Design } from "@revenge-mod/discord/design";
import { BigFlagUtils, PermissionUtils } from "@shared/modules/utils";
import { PermissionRow } from "../components/PermissionRow";
import type { BigFlags } from "@shared/modules/utils";
import type { Role } from "@vencord/discord-types";

type PermissionConstants = Record<string, BigFlags>;

export default function RolePermissionsSheet({ role }: { role: Role }) {
	const permissions = Constants!.Permissions as unknown as PermissionConstants;
	const hasPermission = (key: keyof PermissionConstants) =>
		BigFlagUtils.has(role.permissions, permissions[key]);

	const rolePermissions: string[] = Object.keys(permissions)
		.filter(hasPermission)
		.map(key => PermissionUtils.getPermissionName(permissions[key]));

	return (
		<Design.ActionSheet>
			<Design.BottomSheetTitleHeader
				title={`Added Permissions for ${role.name}`}
			/>

			<Design.ActionSheetRow.Group>
				{rolePermissions.length > 0 ? (
					rolePermissions.map(permission => (
						<PermissionRow label={permission} enabled />
					))
				) : (
					<Design.ActionSheetRow label="This role adds no permissions." />
				)}
			</Design.ActionSheetRow.Group>
		</Design.ActionSheet>
	);
}
