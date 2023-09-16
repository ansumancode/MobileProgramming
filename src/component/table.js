import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_DATA_SETS } from "../graphql/graphql";
import CustomTable from "./tableFilter";

function Table() {
    // useQuery hook to fetch data from GraphQL server and the hook returns an object containing loading, error, and data
  const { loading, error, data } = useQuery(GET_ALL_DATA_SETS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const dataSetJsons = data.allDataSetJsons;

  return (
    <CustomTable dataSetJsons={dataSetJsons} />
  );
}

export default Table;
