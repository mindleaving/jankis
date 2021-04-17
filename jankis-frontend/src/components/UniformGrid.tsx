import React, { ReactNode } from 'react';
import { Col, Row } from 'react-bootstrap';

interface UniformGridProps {
    columnCount: number;
    items: ReactNode[];
    size: "xs" | "sm" | "md" | "lg" | "xl";
}

export const UniformGrid = (props: UniformGridProps) => {

    const columnWidth = 12 / props.columnCount;
    const rows = [];
    let currentRowColumns = [];
    for (let index = 0; index < props.items.length; index++) {
        const element = props.items[index];
        const column = props.size === "sm" ? <Col sm={columnWidth}>{element}</Col>
            : props.size === "md" ? <Col md={columnWidth}>{element}</Col>
            : props.size === "lg" ? <Col lg={columnWidth}>{element}</Col>
            : props.size === "xl" ? <Col xl={columnWidth}>{element}</Col>
            : <Col xs={columnWidth}>{element}</Col>;
        currentRowColumns.push(column);
        if(currentRowColumns.length === props.columnCount) {
            rows.push(<Row>
                {currentRowColumns}
            </Row>);
            currentRowColumns = [];
        }
    }
    if(currentRowColumns.length > 0) {
        rows.push(<Row>
            {currentRowColumns}
        </Row>);
    }
    return (<>
        {rows}
    </>);
}