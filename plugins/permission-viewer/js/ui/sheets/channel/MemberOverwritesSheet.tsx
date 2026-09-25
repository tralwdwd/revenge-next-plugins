import { Design } from "@revenge-mod/discord/design";
import { PermissionRow } from "../../components/PermissionRow";
import { resolveOverwritePermissions } from "./utils";
import type { PermissionOverwrite } from "@vencord/discord-types";

export default function MemberOverwritesSheet({
	name,
	overwrite,
}: {
	name: string;
	overwrite: PermissionOverwrite;
}) {
	const { allow, deny } = resolveOverwritePermissions(overwrite);

	return (
        <Design.ActionSheet>
            <Design.BottomSheetTitleHeader
                title={`Permission Overwrites for ${name}`}
            />

            <Design.ActionSheetRow.Group title="Overwrites">
                {allow.map((permission) => (
                    <PermissionRow label={permission} enabled />
                ))}
                {deny.map((permission) => (
                    <PermissionRow label={permission} />
                ))}

                {allow.length === 0 && deny.length === 0 && (
                    <Design.ActionSheetRow label="No overwrites." />
                )}
            </Design.ActionSheetRow.Group>
        </Design.ActionSheet>
    );
}
