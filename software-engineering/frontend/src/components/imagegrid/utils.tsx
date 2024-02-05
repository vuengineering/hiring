import { imageClient } from "../../utils";
import { SelectedImages } from "./ImageGrid";
import { Case } from "../../api/generated";

export const isAnyCardSelected = (selectedImages: SelectedImages) => {
  return Object.values(selectedImages).some(
    (value) => value.isSelected === true,
  );
};

export const countSelectedCards = (selectedImages: SelectedImages) => {
  return Object.values(selectedImages).filter(
    (value) => value.isSelected === true,
  ).length;
};

export const getSelectedImages = (selectedImages: SelectedImages) => {
  return Object.values(selectedImages)
    .filter((value) => value.isSelected === true)
    .map((value) => value.image);
};

export async function deleteImage(selectedImages: SelectedImages) {
  return await Promise.all(
    getSelectedImages(selectedImages).map(async (image) => {
      await imageClient.imageDestroy(image.id);
      return image.id;
    }),
  );
}

export async function uploadImages(files: FileList, caseObject: Case) {
  return await Promise.all(
    Array.from(files).map(async (file) => {
      return await imageClient.imageCreate(
        new Date().toISOString(),
        file,
        caseObject.id,
      );
    }),
  );
}
