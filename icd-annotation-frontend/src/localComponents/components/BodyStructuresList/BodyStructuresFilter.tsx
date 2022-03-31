import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BodyStructuresFilters } from "./BodyStructuresList";

interface BodyStructuresFilterProps {
    setFilter: (filter: BodyStructuresFilters) => void;
}

export const BodyStructuresFilter = (props: BodyStructuresFilterProps) => {
    const [ searchText, setSearchText ] = useState<string>('');
    const setFilter = props.setFilter;
    useEffect(() => {
        setFilter({
            searchText: searchText && searchText.trim().length > 0 ? searchText.trim() : undefined
        });
    }, [ setFilter, searchText ]);

    return (
        <Form>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            value={searchText}
                            onChange={(e:any) => setSearchText(e.target.value)}
                            placeholder="Search..."
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
}