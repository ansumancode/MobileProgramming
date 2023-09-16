import React, { useState, useMemo } from "react";
import Form from "react-bootstrap/Form";

function CustomTable({ dataSetJsons }) {
  const [search, setSearch] = useState("");
  const [filterOption, setFilterOption] = useState("all");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  //   Table inner data object with functionality is used inside the useMemo function and useMemo used for not to recall or recompute it's value / memorize the value
  const columns = useMemo(
    () => [
      // column info we have title and description
      {
        Header: "Info",
        accessor: (row) => {
          const info = row.info || {}; // Use an empty object if 'info' is undefined
          const title = info.title || "N/A"; // Default value if 'title' is missing
    const description = info.description || "N/A"; // Default value if 'description' is missing
          return (
            <div>
              <div>
                <strong>Title:</strong> {title}
              </div>
              <div>
                <strong>Description:</strong> {description}
              </div>
            </div>
          );
        },
      },
      {
        // for url column
        Header: "Url",
        accessor: "url",
      },
      {
        // for External Docs
        Header: "External Docs",
        accessor: (row) => (
          //looping the list of external data using map funtion
          <ul className="list-group">
            {row?.externalDocs?.map((doc, index) => (
              <li key={index} className="list-group-item">
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                  {doc.description}
                </a>
              </li>
            ))}
          </ul>
        ),
        sortType: "alphanumeric",
      },
    ],
    []
  );

  //   Defined one const and useMemo to access everywhere
  const filteredData = useMemo(() => {
    let filtered = dataSetJsons;
    //  Select option functionality
    if (filterOption !== "all") {
      filtered = filtered.filter((item) =>
        item.externalDocs.find(
          (doc) => doc.description && doc.description.includes(filterOption)
        )
      );
    }

    // sorting funtionality
    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortOrder === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [sortField, sortOrder, filterOption, dataSetJsons]);

  return (
    <div className="container mt-4">
      <Form.Group className="my-4">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="my-4">
        <Form.Control
          as="select"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
        >
          <option value="all">All</option>
          <option value="GraphiQL">GraphiQL</option>
          <option value="Repo">Repo</option>
          <option value="Docs">Docs</option>
        </Form.Control>
      </Form.Group>
      <div className="table-responsive">
        <div className="table-container">
          <table className="table-rwd">
            <tbody>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.Header}
                    className={`${
                      sortField === column.accessor ? `sorted-${sortOrder}` : ""
                    } `}
                    scope="col"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="text-sm m-0">{column.Header}</p>

                      <button
                        onClick={() => {
                          if (sortField === column.accessor) {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          } else {
                            setSortField(column.accessor);
                            setSortOrder("asc");
                          }
                        }}
                        className="button"
                      >
                        🚰
                      </button>
                    </div>
                  </th>
                ))}
              </tr>

              {filteredData
                .filter((item) => {
                  return search.toLowerCase() === ""
                    ? item
                    : item.info.title.toLowerCase().includes(search);
                })
                .map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.Header}>
                        {typeof column.accessor === "function"
                          ? column.accessor(row)
                          : row[column.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomTable;
