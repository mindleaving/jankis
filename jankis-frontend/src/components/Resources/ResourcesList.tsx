import React, { useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { openConfirmAlert } from '../../helpers/AlertHelpers';
import { deleteObject } from '../../helpers/DeleteHelpers';
import { formatLocation } from '../../helpers/Formatters';
import { resolveText } from '../../helpers/Globalizer';
import PagedTableLoader from '../../helpers/PagedTableLoader';
import { ResourcessFilter } from '../../types/frontendTypes';
import { ViewModels } from '../../types/viewModels';
import { PagedTable } from '../PagedTable';

interface ResourcesListProps {
    filter: ResourcessFilter;
}

export const ResourcesList = (props: ResourcesListProps) => {

    const [ resources, setResources ] = useState<ViewModels.ResourceViewModel[]>([]);
    const resourcesLoader = useMemo(() => new PagedTableLoader<ViewModels.ResourceViewModel>(
        'api/resources',
        resolveText('Resources_CouldNotLoad'),
        setResources,
        props.filter
    ), [ props.filter]);
    const history = useHistory();

    const deleteResource = async (id: string, name: string, force: boolean = false) => {
        if(!force) {
            openConfirmAlert(
                id,
                name,
                resolveText('Resource_ConfirmDelete_Title'),
                resolveText('Resource_ConfirmDelete_Message').replace('{0}', name),
                () => deleteResource(id, name, true)
            );
            return;
        }
        await deleteObject(
            `api/resources/${id}`,
            {},
            resolveText('Resource_SuccessfullyDeleted'),
            resolveText('Resource_CouldNotDelete'),
            () => history.goBack()
        );
    }
    return (
        <PagedTable
            onPageChanged={resourcesLoader.load}
            hasCreateNewButton
            onCreateNew={() => history.push('/create/resource')}
        >
            <thead>
                <tr>
                    <th></th>
                    <th>{resolveText('Resource_Name')}</th>
                    <th>{resolveText('Resource_Group')}</th>
                    <th>{resolveText('Resource_Location')}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {resources.length > 0
                ? resources.map(resource => (
                    <tr>
                        <td>
                            <i className="fa fa-trash red clickable" onClick={() => deleteResource(resource.id, resource.name)} />
                        </td>
                        <td>{resource.name}</td>
                        <td>{resource.groupName}</td>
                        <td>{resource.location ? formatLocation(resource.locationViewModel ?? resource.location) : ''}</td>
                        <td>
                            <Button variant="link" onClick={() => history.push(`/resources/${resource.id}/edit`)}>{resolveText('Edit...')}</Button>
                        </td>
                    </tr>
                ))
                : <tr>
                    <td className="text-center" colSpan={4}>{resolveText('NoEntries')}</td>
                </tr>}
            </tbody>
        </PagedTable>
    );

}