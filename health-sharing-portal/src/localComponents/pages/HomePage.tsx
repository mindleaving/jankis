import { useNavigate } from "react-router-dom";
import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { AccountSelectionButtons } from "../components/Home/AccountSelectionButtons";
import { AccountType } from "../types/enums";

interface HomePageProps {

}

export const HomePage = (props: HomePageProps) => {
    const navigate = useNavigate();

    const onAccountTypeSelected = (accountType: AccountType) => {
        navigate(`/login/${accountType.toLowerCase()}`);
    }
    return (
        <>
            <h3 style={{ marginTop: '60px', marginBottom: '30px' }}>{resolveText("SelectAccountType")}:</h3>
            <AccountSelectionButtons
                onAccountTypeSelected={onAccountTypeSelected}
            />
        </>
    );
}

