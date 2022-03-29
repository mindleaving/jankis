import { Button } from "react-bootstrap";

interface AccountSelectionButtonProps {
    imageUrl: string;
    imageAltText: string;
    title: string;
    onClick: () => void;
}
export const AccountSelectionButton = (props: AccountSelectionButtonProps) => {
    return (
        <Button onClick={props.onClick} className="mx-2 d-flex flex-column align-items-center">
            <img src={props.imageUrl} width={256} height={144} alt={props.imageAltText} className="mx-2 my-2" />
            <div className="account-selection-button-title">{props.title}</div>
        </Button>
    )
}