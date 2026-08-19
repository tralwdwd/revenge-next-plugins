/// <reference types="@revenge-mod/types/hidden" />

import * as ActionSheetPatcher from "./patches/actionsheet";
import { patchActionSheet } from "./patches/actionsheet";

export default plugin({
    start({ cleanup, decorate }) {
        patchActionSheet(cleanup);

        decorate((plugin) => {
            plugin.api.unscoped.tralwdwdd = {
                ActionSheetPatcher,
            };
        });
    },
});

type TralwdwddLibrary = {
    ActionSheetPatcher: typeof ActionSheetPatcher;
};

declare module "@revenge-mod/plugins/types" {
    interface UnscopedPreInitPluginApi {
        tralwdwdd: TralwdwddLibrary;
    }
}
