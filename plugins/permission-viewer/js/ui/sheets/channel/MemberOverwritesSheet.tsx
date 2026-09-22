import { Design } from "@revenge-mod/discord/design";
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

            {allow.length > 0 && (
                <Design.ActionSheetRow.Group title="Allowed">
                    {allow.map((permission) => (
                        <Design.ActionSheetRow
                            label={permission}
                        />
                    ))}
                </Design.ActionSheetRow.Group>
            )}

            {deny.length > 0 && (
                <Design.ActionSheetRow.Group title="Denied">
                    {deny.map((permission) => (
                        <Design.ActionSheetRow
                            label={permission}
                            trailing="Denied"
                        />
                    ))}
                </Design.ActionSheetRow.Group>
            )}

            {deny.length === 0 && allow.length === 0 &&(
                <Design.ActionSheetRow.Group>
                    <Design.ActionSheetRow label="No overwrites." />
                </Design.ActionSheetRow.Group>
            )}
        </Design.ActionSheet>
    );
}
