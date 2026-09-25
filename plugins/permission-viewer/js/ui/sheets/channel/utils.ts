import { BigFlagUtils, PermissionUtils } from "@shared/modules/utils";
import type { DiscordModules } from "@revenge-mod/discord/types";
import type { BigFlags } from "@shared/modules/utils";
import type { PermissionOverwrite } from "@vencord/discord-types";

type PermissionConstants = Record<string, BigFlags>;

type ResolvedOverwritePermissions = {
	allow: string[];
	deny: string[];
};

declare module "@revenge-mod/discord/common/constants" {
	// @ts-expect-error
	const Constants:
		| (DiscordModules.Constants & {
				Permissions: PermissionConstants;
		  })
		| undefined;
}

export const resolveOverwritePermissions = (
	overwrite: PermissionOverwrite,
): ResolvedOverwritePermissions => {
	const { allow, deny } = overwrite;

	const permissions = PermissionUtils.OrderedPermissions;
	return {
		allow: Object.values(permissions)
			.filter(flag => BigFlagUtils.has(allow, flag))
			.map(PermissionUtils.getPermissionName),
		deny: Object.values(permissions)
			.filter(flag => BigFlagUtils.has(deny, flag))
			.map(PermissionUtils.getPermissionName),
	};
};
