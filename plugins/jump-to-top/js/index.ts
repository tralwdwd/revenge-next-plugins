import { patchActionSheet } from "./patches/actionsheet";
import { patchJumpToPresent } from "./patches/jumptopresentbutton";

export default plugin({
    start(api) {
        patchJumpToPresent(api);
        patchActionSheet(api);
    },
});
