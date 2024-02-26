import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiPageTemplate,
  EuiTableFieldDataColumnType,
} from "@elastic/eui";
import { caseClient, LoaderData , resultClient, imageClient } from "../utils";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Case,Image } from "../api/generated";
import { useEffect, useState } from "react";
import { ImageGrid, SelectedImages } from "../components/imagegrid/ImageGrid";
import { ImageGridControls } from "../components/imagegrid/ImageGridControls";

interface DashboardProps {
  cases: Case[];
  images: Image[];
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
      field: "Staus",
      name:"Inspection Status",
      sortable: true,
      render: () => "  Passed",

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
    {
      field: "images",
      name: "Product Overview",
      render: (images: { id: number; case: number; capture_datetime: string; file: string }[]) => (
        <>
          {images.map((image, index) => (
            <img
              key={index}
              src='https://media.istockphoto.com/id/1350722246/photo/server-room-background.webp?s=2048x2048&w=is&k=20&c=fVzk6hc-Q7y72ixrkq4YGBYzj2uu-mhGsPqCR9DjofA='
              alt={`Image ${index + 1}`}
              style={{ width: 50, height: 40, marginRight: 5 }}
            />
          ))}
        </>
      ),
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
}) => Promise<{ cases: Case[]; results: any[] }> = async ({ params }) => {
  const caseListPromise = caseClient.caseList();
  const resultDataPromise = resultClient.resultList(); // Assuming there's a method like getResultData() in the resultClient API

  // Wait for both promises to resolve
  const [caseListResponse, resultDataResponse] = await Promise.all([
    caseListPromise,
    resultDataPromise,
  ]);

  // Extract the data from the responses
  const { data: cases } = caseListResponse;
  const { data: results } = resultDataResponse;

  // Return both sets of data
  return { cases, results};

};
