import { useNavigate } from "react-router-dom";
import { resolveText } from "../../sharedCommonComponents/helpers/Globalizer";
import { AccountSelectionButton } from "../components/Home/AccountSelectionButton";

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

