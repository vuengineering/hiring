import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiPageTemplate,
  EuiTableFieldDataColumnType,
} from "@elastic/eui";
import { caseClient, LoaderData } from "../utils";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Case } from "../api/generated";

interface DashboardProps {
  cases: Case[];
}

export function Dashboard() {
  const navigate = useNavigate();

  const { cases } = useLoaderData() as LoaderData<typeof loader>;

  const columns: Array<EuiBasicTableColumn<Case>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      render: (id: number) => (
        <EuiButton
          color="primary"
          onClick={() => {
            navigate(`/case/${id}`);
          }}
        >
          {id}
        </EuiButton>
      ),
    },
    {
      field: "open_datetime",
      name: "Open date",
      sortable: true,
      dataType: "date",
      render: (open_datetime: string) =>
        new Date(open_datetime).toLocaleString(),
    },
    {
      field: "close_datetime",
      name: "Close date",
      sortable: true,
      dataType: "date",
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
    column: EuiTableFieldDataColumnType<Case>,
  ) => {
    const { id } = ccase;
    const { field } = column;
    return {
      className: "customCellClass",
      "data-test-subj": `cell-${id}-${String(field)}`,
      textOnly: true,
    };
  };

  const rightSideButtons = [
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
    </EuiButton>,
  ];

  return (
    <EuiPageTemplate>
      <EuiPageTemplate.Header
        pageTitle={<span>Dashboard</span>}
        iconType={"eye"}
        rightSideItems={rightSideButtons}
      />
      <EuiPageTemplate.Section>
        <EuiBasicTable
          tableCaption="All cases"
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
