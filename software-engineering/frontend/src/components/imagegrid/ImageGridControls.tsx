import React, { useState } from "react";
import { EuiFilePicker, EuiFlexGroup, EuiFlexItem } from "@elastic/eui";
import { Case, Image } from "../../api/generated";
import { MultiSelectionButton } from "./ImageGridSelection";
import { SelectedImages } from "./ImageGrid";
import { deleteImage, uploadImages } from "./utils";
import { useParams, useSubmit } from "react-router-dom";

export function ImageGridControls({
  caseObject,
  selectedImages,
}: {
  images: Image[];
  caseObject: Case;
  selectedImages: SelectedImages;
  setVisibleImages: React.Dispatch<React.SetStateAction<Image[]>>;
}) {
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [filePickerKey, setFilePickerKey] = useState(0); // State to manage the key of the file picker

  const submit = useSubmit();
  const params = useParams();

  const onChangeUploadFiles = async (files: FileList | null) => {
    if (files !== null) {
      setIsUploadLoading(true);
      await uploadImages(files, caseObject);
      setFilePickerKey((prevKey) => prevKey + 1); // Increment the key to force re-render
      setIsUploadLoading(false);
      submit({}, { action: `/case/${params.caseId}/`, method: "get" });
    }
  };

  return (
    <EuiFlexGroup>
      <EuiFlexItem grow={false}>
        <MultiSelectionButton
          selectedImages={selectedImages}
          onDelete={async () => {
            await deleteImage(selectedImages);
            submit({}, { action: `/case/${params.caseId}/`, method: "get" });
          }}
        />
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFilePicker
          compressed={true}
          multiple
          initialPromptText="Upload images"
          onChange={onChangeUploadFiles}
          aria-label="Upload images"
          display="default"
          isLoading={isUploadLoading}
          key={filePickerKey}
          accept=".jpg,.jpeg,.png,.bmp,.tif,.tiff"
        />
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
