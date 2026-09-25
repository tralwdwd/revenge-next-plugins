import { ConstantsModuleId } from "@revenge-mod/discord/common/constants";
import { ImportTrackerModuleId } from "@revenge-mod/discord/common/import-tracker";
import { lookupModule } from "@revenge-mod/modules/finders";
import {
    withDependencies,
    withName,
    withProps,
} from "@revenge-mod/modules/finders/filters";
import { ReactModuleId } from "@revenge-mod/react";
import { proxify } from "@revenge-mod/utils/proxy";
import type { DiscordModules } from "@revenge-mod/discord/types";
import type { useStateFromStores } from "@vencord/discord-types";

const { relative } = withDependencies;

// #region flux

type FluxUtils = {
	useStateFromStoresArray<T = any>(
		stores: DiscordModules.Flux.Store[],
		factory: () => T[],
	): T[];
	useStateFromStores: useStateFromStores;
};

export let FluxUtils: FluxUtils = proxify(() => {
	const [, SlicedToArrayModuleId] = lookupModule(withName("_slicedToArray"))!;

	const [module] = lookupModule(
		withProps<FluxUtils>("useStateFromStoresArray", "useStateFromStores").and(
			withDependencies([
				SlicedToArrayModuleId,
				ReactModuleId,
				null,
				relative(1),
				ImportTrackerModuleId,
			]),
		),
	);

	if (module) return (FluxUtils = module);
})!;

// #endregion

// #region permission stuff

let BigFlagsFilter: number[] = proxify(() => {
	const [, SlicedToArrayModuleId] = lookupModule(withName("_slicedToArray"))!;
	const [, IntegerModuleId] = lookupModule(withName("Integer"))!;

	if (SlicedToArrayModuleId && IntegerModuleId)
		return (BigFlagsFilter = [
			SlicedToArrayModuleId,
			IntegerModuleId,
			ImportTrackerModuleId,
		]);
})!;

export type BigFlags = bigint;

type BigFlagUtils = {
	has(bigflag: BigFlags, flag: BigFlags): boolean;
	getFlag(bit: number): BigFlagUtils;
};

export let BigFlagUtils: BigFlagUtils = proxify(
    () => {
        const [module] = lookupModule(
            withProps<BigFlagUtils>("has", "getFlag").and(
                withDependencies(BigFlagsFilter),
            ),
        );

        if (module) return (BigFlagUtils = module);
    },
    { hint: {} },
)!;

type PermissionUtils = {
    OrderedPermissions: BigFlags[];
	getPermissionName(flags: BigFlags): string;
};

export let PermissionUtils: PermissionUtils = proxify(() => {
	const [module] = lookupModule(
		withProps<PermissionUtils>("OrderedPermissions", "getPermissionName").and(
			withDependencies([
				ConstantsModuleId,
				BigFlagsFilter,
				null,
				ImportTrackerModuleId,
			]),
		),
	);

	if (module) return (PermissionUtils = module);
}, { hint: {} })!;

// #endregion