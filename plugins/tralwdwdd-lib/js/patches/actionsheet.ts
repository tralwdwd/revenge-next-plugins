import { ActionSheetActionCreators } from "@revenge-mod/discord/actions";
import { after, before } from "@revenge-mod/patcher";
import { findInReactFiber } from "@revenge-mod/utils/react";
import type { PluginCleanupApi } from "@revenge-mod/plugins/types";

type ActionSheetCallback<P extends {} = any> = (
    tree: React.ReactElement[],
    props: P,
) => void;

type ActionSheetPatchConfig<P extends {} = any> = {
    finder: string | RegExp;
    callback: ActionSheetCallback<P>;
};

const actionSheetPatches: ActionSheetPatchConfig[] = [];

export function registerActionSheetPatch<P extends {} = any>(
    finder: string | RegExp,
    callback: ActionSheetCallback<P>,
) {
    actionSheetPatches.push({ finder, callback });

    return () => {
        const index = actionSheetPatches.findIndex(
            (patch) => patch.callback === callback,
        );
        if (index !== -1) actionSheetPatches.splice(index, 1);
    };
}

type ActionSheetResultWithTypeFunction = {
    type: React.FC;
};

type ActionSheetResultWithChildren = {
    props: {
        children: React.ReactElement[];
    };
};

export function patchActionSheet(cleanup: PluginCleanupApi) {
    cleanup(
        before(ActionSheetActionCreators, "openLazy", (args) => {
            const [sheet, key, props] = args;

            const patches: ActionSheetPatchConfig[] = [];

            for (const patch of actionSheetPatches) {
                if (typeof patch.finder === "string") {
                    if (key !== patch.finder) continue;
                } else {
                    if (!patch.finder.test(key)) continue;
                }

                patches.push(patch);
            }

            if (patches.length === 0) return args;

            sheet.then((module) => {
                patchSheetModule(
                    module as { default: React.FC },
                    props,
                    cleanup,
                    patches,
                );
            });

            return args;
        }),
    );
}

export function patchSheetModule(
    module: { default: React.FC },
    props: any,
    cleanup: PluginCleanupApi,
    patches: ActionSheetPatchConfig[],
) {
    const unpatch = after(module, "default", (result) => {
        if (typeof (result as any)?.type === "function") {
            cleanup(
                after(
                    result as ActionSheetResultWithTypeFunction,
                    "type",
                    (tree) => {
                        const actionGroups = findInReactFiber(
                            tree as React.ReactElement,
                            (node) =>
                                node?.[0]?.type?.name === "ActionSheetRowGroup",
                        )! as React.ReactElement[];

                        for (const patch of patches) {
                            patch.callback(actionGroups, props);
                        }

                        return tree;
                    },
                ),
            );
        } else {
            const actionGroups = (result as ActionSheetResultWithChildren).props
                .children;

            for (const patch of patches) {
                patch.callback(actionGroups, props);
            }
        }

        unpatch();

        return result;
    });
}

export default { registerActionSheetPatch };
