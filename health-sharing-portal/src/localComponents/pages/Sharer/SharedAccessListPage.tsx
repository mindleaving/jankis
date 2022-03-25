import { resolveText } from "../../../sharedCommonComponents/helpers/Globalizer";
import { AccessRequestList } from "../../components/AccessRequestList";
import { SharedAccessList } from "../../components/Sharer/SharedAccessList";

interface SharedAccessListPageProps {}

export const SharedAccessListPage = (props: SharedAccessListPageProps) => {

    return (
        <>
            <h1>{resolveText("SharedAccess")}</h1>
            <h2>{resolveText("SharedAccess_SentInvites")}</h2>
            <AccessRequestList />
            <h2>{resolveText("SharedAccess_GrantedAccess")}</h2>
            <SharedAccessList />
        </>
    );

}