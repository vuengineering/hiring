import {
  EuiButtonEmpty,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPagination,
  EuiPopover,
} from "@elastic/eui";
import React, { useState } from "react";

interface ImageGridPaginationProps {
  numberOfImages: number;
  imagesPerPage: number;
  pageIndex: number;
  setImagesPerPage: React.Dispatch<React.SetStateAction<number>>;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function ImageGridPagination({
  numberOfImages,
  imagesPerPage,
  pageIndex,
  setImagesPerPage,
  setPageIndex,
}: ImageGridPaginationProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const pageCount = Math.ceil(numberOfImages / imagesPerPage);

  const onButtonClick = () => setIsPopoverOpen(!isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);
  const goToPage = (pageNumber: number) => setPageIndex(pageNumber);

  const button = (
    <EuiButtonEmpty
      size="m"
      color="text"
      iconType="arrowDown"
      iconSide="right"
      onClick={onButtonClick}
    >
      Images per page: {imagesPerPage}
    </EuiButtonEmpty>
  );

  const pageSizes = [8, 16, 32];

  const items = pageSizes.map((size) => (
    <EuiContextMenuItem
      key={`${size} images`}
      onClick={() => {
        closePopover();
        setImagesPerPage(size);
        setPageIndex(0);
      }}
    >
      {size} images
    </EuiContextMenuItem>
  ));

  return (
    <>
      <EuiFlexGroup
        justifyContent="spaceBetween"
        alignItems="center"
        responsive={false}
        wrap
      >
        <EuiFlexItem grow={false}>
          <EuiPopover
            button={button}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
          >
            <EuiContextMenuPanel items={items} />
          </EuiPopover>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiPagination
            aria-label="Custom pagination example"
            pageCount={pageCount}
            activePage={pageIndex}
            onPageClick={goToPage}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
}
