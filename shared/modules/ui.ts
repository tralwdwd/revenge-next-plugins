import { ConstantsModuleId } from "@revenge-mod/discord/common/constants";
import { lookupModule } from "@revenge-mod/modules/finders";
import {
    withDependencies,
    withProps,
} from "@revenge-mod/modules/finders/filters";
import {
    ReactJSXRuntimeModuleId,
    ReactModuleId,
    ReactNativeModuleId,
} from "@revenge-mod/react";
import { proxify } from "@revenge-mod/utils/proxy";
import type { User } from "@vencord/discord-types";

const { partial } = withDependencies; 

type AvatarProps = {
	user: User;
	size?:
		| "extraSmall10"
		| "extraSmall"
		| "small"
		| "small20"
		| "medium"
		| "large"
		| "custom"
		| "refreshSmall16"
		| "small14";
	guildId?: string;
};

type VoidAvatar = React.MemoExoticComponent<React.ComponentType<AvatarProps>>;

type VoidAvatarModule = {
	default: VoidAvatar;
	AvatarSizes: any;
	getStatusSize: any;
};

export let VoidAvatar: VoidAvatar = proxify(() => {
	const [module] = lookupModule(
		withProps<VoidAvatarModule>("AvatarSizes", "getStatusSize").and(
			withDependencies(
				partial([
					ReactModuleId,
					ReactNativeModuleId,
					ConstantsModuleId,
					null,
					ReactJSXRuntimeModuleId,
				]),
			),
		),
	);

	if (module?.default) return (VoidAvatar = module.default);
})!;
