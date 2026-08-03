import ActionSheetPatcher, { patchActionSheet } from "./patches/actionsheet";

export default plugin({
    start({ cleanup }) {
        patchActionSheet(cleanup);

        window.tralwdwdd = {
            ActionSheetPatcher,
        };
    },
});

declare global {
    interface Window {
        tralwdwdd: {
            ActionSheetPatcher: typeof ActionSheetPatcher;
        };
    }
}
