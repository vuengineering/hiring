import {
  EuiButtonIcon,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiLoadingSpinner,
  EuiText,
  EuiAccordion,
  EuiPanel,
} from "@elastic/eui";
import React from "react";
import { Image } from "../../api/generated";

export function ImageGridItem({
  image,
  index,
  cardClicked,
  handleOpenInspectionModal: openModal,
  isSelected,
}: {
  image: Image;
  index: number;
  isSelected: boolean;
  cardClicked: (img: number) => void;
  handleOpenInspectionModal: (imgId: number) => (e: React.MouseEvent) => void;
}) {
  let isInspectionAvailable =
    Array.isArray(image.inspections) && image.inspections.length > 0;
  let isInspectionOK =
    isInspectionAvailable && image.inspections![0].inspection_result;
  let inspectionBadgeColor = !isInspectionAvailable
    ? "orange"
    : isInspectionOK
      ? "green"
      : "lightcoral";
  let inspectionBadgeMsg = !isInspectionAvailable
    ? "Running"
    : isInspectionOK
      ? "OK"
      : "KO";

  return (
    <EuiFlexItem key={index}>
      <div className="cardContainer">
        <EuiCard
          paddingSize="s"
          textAlign="left"
          image={<img src={image.file} alt="" height={200} />}
          title=""
          selectable={{
            onClick: () => cardClicked(image.id),
            isSelected: isSelected,
          }}
        >
          <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
            {/* If inspection OK or running we show the info. */}
            {(isInspectionOK || !isInspectionAvailable) && (
              <EuiFlexItem grow={false}>
                <EuiHealth color={inspectionBadgeColor}>
                  Inspection {inspectionBadgeMsg}
                </EuiHealth>
              </EuiFlexItem>
            )}
            {/* If inspection running show loader icon. */}
            {!isInspectionAvailable && <EuiLoadingSpinner size="l" />}
          </EuiFlexGroup>

          {/* If Inspection KO --> Show inspection errors here*/}
          {!isInspectionOK && isInspectionAvailable && (
            <EuiAccordion
              id={"inspection_results_img_id_" + image.id}
              arrowDisplay="right"
              buttonContent={
                <EuiHealth color={inspectionBadgeColor}>
                  Inspection {inspectionBadgeMsg}
                </EuiHealth>
              }
            >
              <EuiPanel color="subdued">
                Last inspections results:
                <EuiButtonIcon
                  className="eui-displayInline inspectionsBtn"
                  title={"See Inspections History"}
                  display="base"
                  iconType="eye"
                  aria-label="Next"
                  color="primary"
                  size="s"
                  data-img-id={image.id}
                  onClick={openModal(image.id)}
                />
                <EuiText size="s">
                  <ul>
                    {image.inspections![0].inspection_errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </EuiText>
              </EuiPanel>
            </EuiAccordion>
          )}
        </EuiCard>
      </div>
    </EuiFlexItem>
  );
}
