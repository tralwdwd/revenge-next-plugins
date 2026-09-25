import { patchActionSheet } from "./patches/actionsheet";
import { patchUserProfileMenu } from "./patches/profile";

export default plugin({
    start(api) {
        patchActionSheet(api);
        patchUserProfileMenu(api);

        const { plugin } = api;

        if (plugin.startedLate) plugin.requireReload();
    }
});