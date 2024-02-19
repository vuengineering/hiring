import React, { useEffect, useState } from "react";
import {
  EuiButton,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  useIsWithinBreakpoints,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSpacer,
  EuiOutsideClickDetector,
  EuiText,
} from "@elastic/eui";
import { ImageGridPagination } from "./ImageGridPagination";
import { useLoaderData } from "react-router-dom";
import { LoaderData } from "../../utils";
import { loader } from "../../views/CaseOverview";
import { Image } from "../../api/generated";
import { ImageGridControls } from "./ImageGridControls";

// Import custom styles
import "./CardWithBadge.css";
import { ImageGridItem } from "./ImageGridItem";

export interface SelectedImages {
  [key: number]: { isSelected: boolean; image: Image };
}

export function ImageGrid() {
  // Get the loader data for the nearest ancestor Route loader
  const { images, caseObject } = useLoaderData() as LoaderData<typeof loader>;

  const [pageIndex, setPageIndex] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(8);
  const [allImages, setAllImages] = useState<Image[]>(images);
  const [selectedImages, setSelectedImages] = useState<SelectedImages>({});
  const [visibleImages, setVisibleImages] = useState<Image[]>(allImages);

  const isMobile = useIsWithinBreakpoints(["xs", "s", "m"]);

  // INSPECTION DATA MODAL
  const [inspectionModal, setInspectionModal] = useState<{
    show: boolean;
    imgId: number | null;
  }>({ show: false, imgId: null });

  const handleOpenInspectionModal =
    (imgId: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      setInspectionModal({ show: true, imgId: imgId });
    };
  const handleCloseInspectionModal = () =>
    setInspectionModal({ show: false, imgId: null });

  function InspectionModal({ imgId }: { imgId: number | null }) {
    let imgToShow = allImages.find((img) => img.id === imgId);
    let filePath = imgToShow!.file.split("?")[0];
    let filename = filePath.substring(filePath.lastIndexOf("/") + 1);
    return (
      <EuiOutsideClickDetector onOutsideClick={handleCloseInspectionModal}>
        <EuiModal onClose={handleCloseInspectionModal}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>Inspection Errors History</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>
            Showing all inspections run on img <b>{filename}</b>
            <EuiSpacer />
            {imgId && (
              <EuiText>
                <ul>
                  {imgToShow!.inspections![0].inspection_errors.map(
                    (err, i) => (
                      <li key={i}>{err}</li>
                    ),
                  )}
                </ul>
              </EuiText>
            )}
          </EuiModalBody>
          <EuiModalFooter>
            <EuiButton onClick={handleCloseInspectionModal} fill>
              Close
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOutsideClickDetector>
    );
  }

  useEffect(() => {
    setAllImages(images);
    setVisibleImages(images);
    setSelectedImages({});
  }, [images, setAllImages, setVisibleImages, setSelectedImages]);

  useEffect(() => {
    // calculate the maximum valid pageIndex
    const maxPageIndex = Math.ceil(allImages.length / imagesPerPage) - 1;

    if (pageIndex > maxPageIndex) {
      // if current pageIndex is more than the max valid page index, update it to the max
      setPageIndex(maxPageIndex < 0 ? 0 : maxPageIndex);
    }
  }, [imagesPerPage, allImages.length, pageIndex, setPageIndex]);

  const cardClicked = (imageId: number) => {
    const clickedImage = allImages.find((image) => image.id === imageId);

    if (clickedImage) {
      setSelectedImages({
        ...selectedImages,
        [imageId]: {
          isSelected: !(
            selectedImages[imageId] && selectedImages[imageId].isSelected
          ),
          image: clickedImage,
        },
      });
    }
  };

  const start = pageIndex * imagesPerPage;
  const end = Math.min(start + imagesPerPage, visibleImages.length);
  const pageImages = visibleImages.slice(start, end);

  return (
    <EuiFlexGroup direction="column">
      <EuiFlexItem grow={false}>
        <ImageGridControls
          images={allImages}
          caseObject={caseObject}
          selectedImages={selectedImages}
          setVisibleImages={setVisibleImages}
        />
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFlexGrid responsive={true} columns={isMobile ? 2 : 4}>
          {/* GENERATE IMAGE GRID ITEMS */}
          {pageImages.map((img, i) => (
            <ImageGridItem
              key={i}
              image={img}
              index={i}
              cardClicked={cardClicked}
              handleOpenInspectionModal={handleOpenInspectionModal}
              isSelected={
                selectedImages[img.id] && selectedImages[img.id].isSelected
              }
            />
          ))}
        </EuiFlexGrid>
        {/* Modal to show inspection errors */}
        {inspectionModal.show && inspectionModal.imgId && (
          <InspectionModal imgId={inspectionModal.imgId} />
        )}

        {pageImages.length > 0 && (
          <ImageGridPagination
            imagesPerPage={imagesPerPage}
            numberOfImages={allImages.length}
            setImagesPerPage={setImagesPerPage}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
          />
        )}
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}
