import { patchSearchRowList } from "./patches/searchrowlist";

export default plugin({
    start({ cleanup }) {
        patchSearchRowList(cleanup);
    },
});
