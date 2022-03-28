import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";

interface HomePageProps {

}

export const HomePage = (props: HomePageProps) => {
    const navigate = useNavigate();
    return (
        <>
            <h1>{resolveText("HealthSharingPortal")}</h1>
            <h3 style={{ marginTop: '100px', marginBottom: '30px' }}>{resolveText("SelectAccountType")}:</h3>
            <div className="d-flex align-items-center">
                <div className="d-flex align-items-stretch mx-auto">
                    <AccountSelectionButton
                        title={resolveText("Sharer")}
                        imageUrl="/sharer.jpg"
                        imageAltText={resolveText("Sharer_ImageAltText")}
                        onClick={() => navigate("/login/sharer")}
                    />
                    <AccountSelectionButton
                        title={resolveText("HealthProfessional")}
                        imageUrl="/healthprofessional.jpg"
                        imageAltText={resolveText("HealthProfessional_ImageAltText")}
                        onClick={() => navigate("/login/healthprofessional")}
                    />
                    <AccountSelectionButton
                        title={resolveText("Researcher")}
                        imageUrl="/researcher.jpg"
                        imageAltText={resolveText("Researcher_ImageAltText")}
                        onClick={() => navigate("/login/researcher")}
                    />
                </div>
            </div>
        </>
    );
}

interface AccountSelectionButtonProps {
    imageUrl: string;
    imageAltText: string;
    title: string;
    onClick: () => void;
}
const AccountSelectionButton = (props: AccountSelectionButtonProps) => {
    return (
        <Button onClick={props.onClick} className="mx-2 d-flex flex-column align-items-center">
            <img src={props.imageUrl} width={256} height={144} alt={props.imageAltText} className="mx-2 my-2" />
            <div className="account-selection-button-title">{props.title}</div>
        </Button>
    )
}