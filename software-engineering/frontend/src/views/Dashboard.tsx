import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiEmptyPrompt,
  EuiLink,
  EuiPageTemplate,
  EuiTableFieldDataColumnType,
} from "@elastic/eui";
import { caseClient, LoaderData } from "../utils";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Case } from "../api/generated";
import "./DashboardTable.css";

interface DashboardProps {
  cases: Case[];
}

export function Dashboard() {
  const navigate = useNavigate();

  const { cases } = useLoaderData() as LoaderData<typeof loader>;

  const createCaseButton = (
    <EuiButton
      color="primary"
      iconType="createSingleMetricJob"
      onClick={() =>
        caseClient.caseCreate({}).then((response) => {
          navigate(`/case/${response.data.id}`);
        })
      }
    >
      New Case
    </EuiButton>
  );

  const message = (
    <EuiEmptyPrompt
      title={<h3>No Cases</h3>}
      titleSize="xs"
      body="Looks like you don&rsquo;t have any cases available. Let&rsquo;s add some!"
      actions={createCaseButton}
    />
  );

  const columns: Array<EuiBasicTableColumn<Case>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      mobileOptions: {
        header: false,
      },
      width: "500px",
      render: (id: number) => (
        <EuiLink onClick={() => navigate(`/case/${id}`)}>
          Inspection Case #{id}
        </EuiLink>
      ),
    },
    {
      field: "images",
      name: "No of Images",
      sortable: true,
      dataType: "number",
      width: "500px",
      mobileOptions: {
        header: false,
      },
      render: (image: Array<Number>) => image.length,
    },
    {
      field: "open_datetime",
      name: "Open date",
      sortable: true,
      dataType: "date",
      width: "500px",
      mobileOptions: {
        header: false,
      },
      render: (open_datetime: string) =>
        new Date(open_datetime).toLocaleString(),
    },
    {
      field: "close_datetime",
      name: "Close date",
      sortable: true,
      dataType: "date",
      width: "500px",
      mobileOptions: {
        header: false,
      },
      render: (close_datetime: string) =>
        close_datetime ? new Date(close_datetime).toLocaleString() : "Open",
    },
  ];

  const getRowProps = (ccase: Case) => {
    const { id } = ccase;
    return {
      "data-test-subj": `row-${id}`,
      className: "customRowClass",
      onClick: () => {
        navigate(`/case/${id}`);
      },
    };
  };

  const getCellProps = (
    ccase: Case,
    column: EuiTableFieldDataColumnType<Case>
  ) => {
    const { id } = ccase;
    const { field } = column;
    return {
      className: "customCellClass",
      "data-test-subj": `cell-${id}-${String(field)}`,
      textOnly: true,
    };
  };

  const rightSideButtons = [createCaseButton];

  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header
        pageTitle={<span>Dashboard</span>}
        iconType={"eye"}
        rightSideItems={rightSideButtons}
      />
      <EuiPageTemplate.Section>
        <EuiBasicTable
          noItemsMessage={message}
          items={cases}
          columns={columns}
          rowHeader="id"
          rowProps={getRowProps}
          cellProps={getCellProps}
          responsive={true}
        />
      </EuiPageTemplate.Section>
    </EuiPageTemplate>
  );
}

export const loader: ({
  params,
}: {
  params: any;
}) => Promise<DashboardProps> = async ({ params }) => {
  const { data: cases } = await caseClient.caseList();
  return { cases };
};
