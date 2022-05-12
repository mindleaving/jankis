import { Models } from "../../localComponents/types/models";

export const ImageExtensions = [ ".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".svg", ".gif" ];
export const PdfExtensions = [ ".pdf" ];
export const JsonExtensions = [ ".json" ];
export const TextExtensions = [ ".txt", ".csv", ".tsv", ".sh", ".bat", ".py", ".cs", ".yaml", ".yml", ".xml" ];
export const hasExtension = (lowerFilename: string, extensions: string[]) => {
    return extensions.some(extension => lowerFilename.endsWith(extension));
}
export const canViewDocument = (document: Models.PatientDocument) => {
    if(!document) {
        return false;
    }
    const lowerFilename = document.fileName.toLowerCase();
    const combinedExtensions = ImageExtensions
        .concat(PdfExtensions)
        .concat(JsonExtensions)
        .concat(TextExtensions);
    return hasExtension(lowerFilename, combinedExtensions);
}