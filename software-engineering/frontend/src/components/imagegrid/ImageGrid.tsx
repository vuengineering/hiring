import React, { useEffect, useState } from "react";
import {
  EuiCard,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  useIsWithinBreakpoints,
} from "@elastic/eui";
import { ImageGridPagination } from "./ImageGridPagination";
import "./CardWithBadge.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import { LoaderData } from "../../utils";
import { loader } from "../../views/CaseOverview";
import { Image } from "../../api/generated";
import { ImageGridControls } from "./ImageGridControls";

export interface SelectedImages {
  [key: number]: { isSelected: boolean; image: Image };
}

export function ImageGrid() {
  const { images, caseObject } = useLoaderData() as LoaderData<typeof loader>;

  const [pageIndex, setPageIndex] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(8);
  const [allImages, setAllImages] = useState<Image[]>(images);
  const [selectedImages, setSelectedImages] = useState<SelectedImages>({});
  const [visibleImages, setVisibleImages] = useState<Image[]>(allImages);

  const isMobile = useIsWithinBreakpoints(["xs", "s", "m"]);

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
          {pageImages.map((image, index) => (
            <EuiFlexItem key={index}>
              <div className="cardContainer">
                <EuiCard
                  paddingSize="s"
                  textAlign="left"
                  image={<img src={image.file} alt="" height={200} />}
                  title=""
                  selectable={{
                    onClick: () => cardClicked(image.id),
                    isSelected:
                      selectedImages[image.id] &&
                      selectedImages[image.id].isSelected,
                  }}
                />
              </div>
            </EuiFlexItem>
          ))}
        </EuiFlexGrid>
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
