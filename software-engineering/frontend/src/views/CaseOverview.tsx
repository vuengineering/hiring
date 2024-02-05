import {
  EuiBadge,
  EuiBreadcrumb,
  EuiButton,
  EuiButtonIcon,
  EuiConfirmModal,
  EuiPageTemplate,
  EuiTextColor,
} from "@elastic/eui";
import { ImageGrid } from "../components/imagegrid/ImageGrid";
import { caseClient, imageClient, LoaderData } from "../utils";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Case, Image } from "../api/generated";
import { useState } from "react";

interface CaseOverviewProps {
  caseObject: Case;
  images: Image[];
}

export function CaseOverview() {
  const [isCloseLoading, setIsCloseLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDeleteCaseModalVisible, setIsDeleteCaseModalVisible] =
    useState(false);
  const [isCloseCaseModalVisible, setIsCloseCaseModalVisible] = useState(false);

  const navigate = useNavigate();

  const { caseObject, images } = useLoaderData() as LoaderData<typeof loader>;

  let infos = [
    {
      title: "Case id",
      description: String(caseObject.id),
    },
  ];

  if (caseObject.close_datetime) {
    infos.push({
      title: "Closed",
      description: `on ${new Date(caseObject.close_datetime).toLocaleString()}`,
    });
  }

  const caseStatusBadge = caseObject.close_datetime ? (
    <EuiBadge color="success" iconType="check">
      Closed
    </EuiBadge>
  ) : (
    <EuiBadge color="default" iconType="eye">
      Open
    </EuiBadge>
  );

  const closeCaseButton = (
    <EuiButton
      onClick={() => setIsCloseCaseModalVisible(true)}
      iconType="folderCheck"
      color="success"
      isLoading={isCloseLoading}
      isDisabled={caseObject.close_datetime !== null}
    >
      Close Case
    </EuiButton>
  );

  const deleteCaseButton = (
    <EuiButtonIcon
      onClick={() => setIsDeleteCaseModalVisible(true)}
      iconType="trash"
      color="text"
      size="m"
      display="base"
      isLoading={isDeleteLoading}
      aria-label="Delete Case"
    />
  );

  const returnDashboardButton: EuiBreadcrumb[] = [
    {
      text: "← Dashboard",
      onClick: () => navigate("/"),
      "aria-label": "Link back to Dashboard",
    },
  ];

  const rightSideButtons = [deleteCaseButton, closeCaseButton];

  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header
        pageTitle={
          <span>
            Inspection Case{" "}
            <EuiTextColor color="subdued" style={{ fontWeight: "normal" }}>
              {"#" + String(caseObject.id)}
            </EuiTextColor>{" "}
            {caseStatusBadge}
          </span>
        }
        rightSideItems={rightSideButtons}
        iconType={"addDataApp"}
        breadcrumbs={returnDashboardButton}
        breadcrumbProps={{ lastBreadcrumbIsCurrentPage: false }}
      />

      <EuiPageTemplate.Section>
        <ImageGrid />
      </EuiPageTemplate.Section>
      {/* Modal to confirm the Deletion of the case */}
      {isDeleteCaseModalVisible && (
        <EuiConfirmModal
          title={`Delete Case?`}
          onCancel={() => setIsDeleteCaseModalVisible(false)}
          onConfirm={async () => {
            setIsDeleteCaseModalVisible(false);
            setIsDeleteLoading(true);
            await caseClient.caseDestroy(caseObject.id);
            navigate("/");
          }}
          cancelButtonText="Cancel"
          confirmButtonText="Delete Case"
          buttonColor="danger"
          defaultFocusedButton="confirm"
        >
          <p>
            Are you sure you want to delete this Case? This operation is
            irreversible.
          </p>
        </EuiConfirmModal>
      )}
      {/* Modal to confirm the closing of the case */}
      {isCloseCaseModalVisible && (
        <EuiConfirmModal
          title={`Close Inspection Case #${caseObject.id}?`}
          onCancel={() => setIsCloseCaseModalVisible(false)}
          onConfirm={async () => {
            setIsCloseCaseModalVisible(false);
            setIsCloseLoading(true);
            await caseClient.casePartialUpdate(caseObject.id, {
              close_datetime: new Date().toISOString(),
            });
            navigate("/");
          }}
          cancelButtonText="Cancel"
          confirmButtonText="Close Case"
          buttonColor="success"
          defaultFocusedButton="confirm"
        />
      )}
    </EuiPageTemplate>
  );
}

export const loader: ({
  params,
}: {
  params: any;
}) => Promise<CaseOverviewProps> = async ({ params }) => {
  const { data: caseObject } = await caseClient.caseRetrieve(params.caseId);
  let images: Image[] = [];
  if (caseObject.images?.length) {
    images = (await imageClient.imageList(caseObject.images)).data;
  }
  return {
    caseObject: caseObject,
    images: images,
  };
};
