import {
  EuiBadge,
  EuiBreadcrumb,
  EuiPageTemplate,
  EuiTextColor,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiTableFieldDataColumnType,
} from "@elastic/eui";
import { caseClient, LoaderData } from "../utils";
import { useLoaderData, useNavigate } from "react-router-dom";
import { CaseResult, ImageResult, Result } from "../api/generated";

interface CaseResultProps {
  caseResult: CaseResult;
}

export function CaseResultView() {
  const navigate = useNavigate();

  const { caseResult } = useLoaderData() as LoaderData<typeof loader>;

  const returnDashboardButton: EuiBreadcrumb[] = [
    {
      text: "← Dashboard",
      onClick: () => navigate("/"),
      "aria-label": "Link back to Dashboard",
    },
  ];

  const returnResultStatus = (result: Result) => {
    return result ? result.status : "--";
  };

  const columns: Array<EuiBasicTableColumn<ImageResult>> = [
    {
      field: "id",
      name: "ID",
    },
    {
      field: "case",
      name: "Case ID",
      render: (caseId: string | number) => (
        <p style={{ textAlign: "center" }}>{caseId}</p>
      ),
    },
    {
      field: "capture_datetime",
      name: "Datetime",
      sortable: true,
      dataType: "date",
      render: (open_datetime: string) =>
        new Date(open_datetime).toLocaleString(),
    },
    {
      field: "results",
      name: "Results",
      render: (results: Result) => (
        <pre>{JSON.stringify(results, null, 4)} </pre>
      ),
    },
    {
      field: "results",
      name: "Result Status",
      render: (results: Result) => returnResultStatus(results),
    },
  ];

  const caseStatusBadge = (
    <EuiBadge color="default" iconType="eye">
      Open
    </EuiBadge>
  );

  const getCellProps = (
    image: ImageResult,
    column: EuiTableFieldDataColumnType<ImageResult>,
  ) => {
    return {
      className: "customCellClass",
      textOnly: true,
    };
  };
  const getRowProps = (image: ImageResult) => {
    return {
      className: "customRowClass",
      onClick: () => {},
    };
  };

  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header
        pageTitle={
          <span>
            Inspection Case{" "}
            <EuiTextColor color="subdued" style={{ fontWeight: "normal" }}>
              {/* {"#" + String(caseResult.id)} */}
            </EuiTextColor>{" "}
            {caseStatusBadge}
          </span>
        }
        iconType={"addDataApp"}
        breadcrumbs={returnDashboardButton}
        breadcrumbProps={{ lastBreadcrumbIsCurrentPage: false }}
      />
      <EuiPageTemplate.Section>
        <EuiBasicTable
          tableCaption="Demo of EuiBasicTable"
          items={caseResult.images}
          rowHeader="id"
          columns={columns}
          rowProps={getRowProps}
          cellProps={getCellProps}
        />
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}

export const loader: ({
  params,
}: {
  params: any;
}) => Promise<CaseResultProps> = async ({ params }) => {
  const { data: caseResultObject } = await caseClient.caseResultRetrieve(
    params.caseId,
  );
  return {
    caseResult: caseResultObject,
  };
};
