import { patchActionSheet } from "./patches/actionsheet";

export default plugin({
    start({ cleanup }) {
        patchActionSheet(cleanup);
    },
});
