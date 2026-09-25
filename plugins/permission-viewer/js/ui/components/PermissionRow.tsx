import { TableRowAssetIcon } from "@revenge-mod/components";
import { Design } from "@revenge-mod/discord/design";

export function PermissionRow({
	label,
	enabled = true,
}: {
	label: string;
	enabled?: boolean;
}) {
	const icon = enabled ? (
		<TableRowAssetIcon name="Check" />
	) : (
		<TableRowAssetIcon name="ic_close_16px" />
	);

	return <Design.TableRow label={label} trailing={icon} />;
}
