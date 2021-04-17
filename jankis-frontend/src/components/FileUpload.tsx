import React from 'react';
import Dropzone from 'react-dropzone'

interface FileUploadProps {
    onDrop: (files: File[]) => void;
}

export const FileUpload = (props: FileUploadProps) => {

    return (
        <Dropzone onDrop={props.onDrop}>
            {({ getRootProps, getInputProps }) => (
                <section>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                </section>
            )}
        </Dropzone>
    );

}