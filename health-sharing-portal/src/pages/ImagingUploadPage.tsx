import React, { FormEvent, useState } from 'react';
import { Form, FormGroup } from 'react-bootstrap';
import { AsyncButton } from '../components/AsyncButton';
import { FileUpload } from '../components/FileUpload';
import { NotificationManager } from 'react-notifications';
import { apiClient } from '../communication/ApiClient';
import { ListFormControl } from '../components/ListFormControl';

interface ImagingUploadPageProps {}

export const ImagingUploadPage = (props: ImagingUploadPageProps) => {

    const [ files, setFiles ] = useState<File[]>([]);
    const [ isUploading, setIsUploading ] = useState<boolean>(false);

    const onDrop = (files: File[]) => {
        setFiles(state => state.concat(files));
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            for(let file of files) {
                await apiClient.post('api/imaging/upload', {}, file);
            }
            NotificationManager.success("Upload successful");
        } catch(error: any) {
            NotificationManager.error(error.message, "Could not upload");
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <>
            <h1>Upload imaging data</h1>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Form.Label></Form.Label>
                    <FileUpload
                        onDrop={onDrop}
                    />
                </FormGroup>
                <FormGroup>
                    <Form.Label>Selected files</Form.Label>
                    <ListFormControl
                        items={files}
                        idFunc={x => x.name}
                        displayFunc={x => x.name}
                        removeItem={x => setFiles(files.filter(file => file !== x))}
                    />
                </FormGroup>
                <AsyncButton
                    type='submit'
                    className='mt-3'
                    activeText='Upload'
                    executingText='Uploading...'
                    isExecuting={isUploading}
                    disabled={files.length === 0}
                />
            </Form>
        </>
    );

}