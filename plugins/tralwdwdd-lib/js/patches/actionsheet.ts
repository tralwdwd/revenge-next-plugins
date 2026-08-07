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

type MemoSheet = React.MemoExoticComponent<React.ComponentType<any>>;

type ActionSheetModule = {
    default: React.FC | MemoSheet;
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
                    module as ActionSheetModule,
                    props,
                    cleanup,
                    patches,
                );
            });

            return args;
        }),
    );
}

function findActionGroups(tree: React.ReactElement): React.ReactElement[] {
    return (findInReactFiber(
        tree as React.ReactElement,
        (node) => node?.[0]?.type?.name === "ActionSheetRowGroup",
    ) ??
        (
            findInReactFiber(
                tree as React.ReactElement,
                (node) => node.type?.name === "Stack",
            ) as React.ReactElement<React.PropsWithChildren> | undefined
        )?.props?.children) as React.ReactElement[];
}

function patchMemoSheet(
    module: ActionSheetModule,
    props: any,
    cleanup: PluginCleanupApi,
    patches: ActionSheetPatchConfig[],
) {
    // @ts-expect-error
    const unpatch = after(module.default as MemoSheet, "type", (tree) => {
        const actionGroups = findActionGroups(tree as React.ReactElement);

        if (actionGroups) {
            for (const patch of patches) patch.callback(actionGroups, props);
        }

        unpatch();

        return tree;
    });
    cleanup(unpatch);
}

function patchLazySheet(
    module: ActionSheetModule,
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
                        const actionGroups = findActionGroups(
                            tree as React.ReactElement,
                        );

                        if (actionGroups) {
                            for (const patch of patches)
                                patch.callback(actionGroups, props);
                        }
                        return tree;
                    },
                ),
            );
        } else {
            const actionGroups = (result as ActionSheetResultWithChildren).props
                .children;
            if (actionGroups) {
                for (const patch of patches)
                    patch.callback(actionGroups, props);
            }
        }

        unpatch();

        return result;
    });
    cleanup(unpatch);
}

export function patchSheetModule(
    module: ActionSheetModule,
    props: any,
    cleanup: PluginCleanupApi,
    patches: ActionSheetPatchConfig[],
) {
    if (typeof module.default === "object") {
        patchMemoSheet(module, props, cleanup, patches);
    } else {
        patchLazySheet(module, props, cleanup, patches);
    }
}

export default { registerActionSheetPatch };
