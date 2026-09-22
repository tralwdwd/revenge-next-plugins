import { Constants } from "@revenge-mod/discord/common/constants";
import { BigFlagUtils, PermissionNameUtils } from "@shared/modules/utils";
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

	const permissions = Constants!.Permissions;
	return {
		allow: Object.values(permissions)
			.filter(flag => BigFlagUtils.has(allow, flag))
			.map(PermissionNameUtils.getPermissionName),
		deny: Object.values(permissions)
			.filter(flag => BigFlagUtils.has(deny, flag))
			.map(PermissionNameUtils.getPermissionName),
	};
};
