import { Design } from "@revenge-mod/discord/design";
import { PermissionRow } from "../../components/PermissionRow";
import { resolveOverwritePermissions } from "./utils";
import type { PermissionOverwrite, Role } from "@vencord/discord-types";

export default function RoleOverwritesSheet({
	role,
	overwrite,
}: {
	role: Role;
	overwrite: PermissionOverwrite;
}) {
	const { allow, deny } = resolveOverwritePermissions(overwrite);

	return (
		<Design.ActionSheet>
			<Design.BottomSheetTitleHeader
				title={`Permission Overwrites for ${role.name}`}
			/>

			<Design.ActionSheetRow.Group title="Overwrites">
				{allow.map(permission => (
					<PermissionRow label={permission} enabled />
				))}
				{deny.map(permission => (
					<PermissionRow label={permission} />
				))}

				{allow.length === 0 &&
					(deny.length === 0 && (
						<Design.ActionSheetRow label="No overwrites." />
					))}
			</Design.ActionSheetRow.Group>
		</Design.ActionSheet>
	);
}
