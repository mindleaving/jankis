import { useNavigate } from "react-router-dom";
import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { AccountSelectionButtons } from "../components/Home/AccountSelectionButtons";
import { AccountType } from "../types/enums";

interface HomePageProps {

}

export const HomePage = (props: HomePageProps) => {
    const navigate = useNavigate();

    const onAccountTypeSelected = (accountType: AccountType) => {
        navigate(`/login/${accountType}`);
    }
    return (
        <>
            <h1>{resolveText("HealthSharingPortal")}</h1>
            <h3 style={{ marginTop: '100px', marginBottom: '30px' }}>{resolveText("SelectAccountType")}:</h3>
            <AccountSelectionButtons
                onAccountTypeSelected={onAccountTypeSelected}
            />
        </>
    );
}

