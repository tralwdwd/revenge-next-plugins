import { ConstantsModuleId } from "@revenge-mod/discord/common/constants";
import { ImportTrackerModuleId } from "@revenge-mod/discord/common/import-tracker";
import { LoggerModuleId } from "@revenge-mod/discord/common/logger";
import { lookupModule } from "@revenge-mod/modules/finders";
import {
    withDependencies,
    withProps,
} from "@revenge-mod/modules/finders/filters";
import { proxify } from "@revenge-mod/utils/proxy";

const { relative } = withDependencies;

type ChannelRouter = {
    transitionToChannel(id: string): void;
};

export let ChannelRouter: ChannelRouter = proxify(() => {
    const [module] = lookupModule(
        withProps("transitionToChannel", "transitionToThread").and(
            withDependencies([
                withProps("getChannel", "hasChannel"),
                ConstantsModuleId,
                relative(1),
                relative(2),
                null,
                null,
                null,
                ImportTrackerModuleId,
            ]),
        ),
    );

    if (module) return (ChannelRouter = module);
}, {})!;

type GuildRouter = {
    transitionTo(location: string): void;
};

export let GuildRouter: GuildRouter = proxify(() => {
    const [module] = lookupModule(
        withProps("transitionTo", "transitionToGuild").and(
            withDependencies([
                ConstantsModuleId,
                LoggerModuleId,
                relative(1),
                null,
                null,
                ImportTrackerModuleId,
            ]),
        ),
    );

    if (module) return (GuildRouter = module);
}, {})!;