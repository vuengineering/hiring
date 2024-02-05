import React, { useState } from "react";
import {
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
  EuiPopoverTitle,
  EuiSpacer,
} from "@elastic/eui";
import { SelectedImages } from "./ImageGrid";
import { countSelectedCards, isAnyCardSelected } from "./utils";

export function PopoverMenuActions({
  onDelete,
  setIsPopoverOpen,
}: {
  onDelete: () => Promise<void>;
  setIsPopoverOpen: (isOpen: boolean) => void;
}) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  return (
    <>
      <EuiSpacer size="s" />
      <button
        onClick={async () => {
          setIsDeleteLoading(true);
          await onDelete();
          setIsDeleteLoading(false);
          setIsPopoverOpen(false);
        }}
      >
        <EuiFlexGroup alignItems="center" component="span" gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              aria-label="Delete selected images"
              iconType="trash"
              color="text"
              isLoading={isDeleteLoading}
            />
          </EuiFlexItem>
          <EuiFlexItem>Delete</EuiFlexItem>
        </EuiFlexGroup>
      </button>
    </>
  );
}

export function MultiSelectionButton({
  selectedImages,
  onDelete,
}: {
  selectedImages: SelectedImages;
  onDelete: () => Promise<void>;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // check if there are any selected cards
  if (isAnyCardSelected(selectedImages)) {
    const selectedCardCount = countSelectedCards(selectedImages);
    return (
      <EuiPopover
        isOpen={isPopoverOpen}
        anchorPosition="upCenter"
        button={
          <EuiButtonEmpty
            size="s"
            iconType="arrowDown"
            iconSide="right"
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            {selectedCardCount} {selectedCardCount > 1 ? "images" : "image"}{" "}
            selected
          </EuiButtonEmpty>
        }
        closePopover={() => setIsPopoverOpen(false)}
      >
        <EuiPopoverTitle>
          {selectedCardCount} {selectedCardCount > 1 ? "images" : "image"}
        </EuiPopoverTitle>
        <PopoverMenuActions
          onDelete={onDelete}
          setIsPopoverOpen={setIsPopoverOpen}
        />
      </EuiPopover>
    );
  } else {
    return null;
  }
}
