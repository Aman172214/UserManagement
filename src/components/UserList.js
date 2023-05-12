import React, { useState, useEffect, useCallback } from "react";
import "./UserList.css";
import jsonData from "../heliverse_mock_data.json";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filters, setFilters] = useState({
    domain: "",
    gender: "",
    available: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [team, setTeam] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamCreated, setTeamCreated] = useState(false);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    // Filter the mock data based on the search term and filters
    let filteredUsers = jsonData.filter((user) => {
      const name = user.first_name + " " + user.last_name;
      const filterDomain =
        filters.domain === "" || user.domain === filters.domain;
      const filterGender =
        filters.gender === "" || user.gender === filters.gender;
      const filterAvailability =
        filters.available === "" ||
        user.available === (filters.available === "true");

      return (
        name.toLowerCase().includes(searchName.toLowerCase()) &&
        filterDomain &&
        filterGender &&
        filterAvailability
      );
    });

    setUsers(filteredUsers);
  }, [searchName, filters]);

  useEffect(() => {
    // Reset pagination when the filtered users change
    setCurrentPage(1);
  }, [users]);

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddToTeam = (user) => {
    if (
      user.available &&
      !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
    ) {
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
      setTeamCreated(false);
    }
  };

  const handleRemoveFromTeam = (user) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((selectedUser) => selectedUser.id !== user.id)
    );
    setTeamCreated(false);
  };

  const handleCreateTeam = useCallback(() => {
    const uniqueDomains = Array.from(
      new Set(selectedUsers.map((user) => user.domain))
    );
    const teamMembers = selectedUsers.filter((user) =>
      uniqueDomains.includes(user.domain)
    );
    setTeam(teamMembers);

    // Clear the selected users and team
    // setSelectedUsers([]);
    // setTeam([]);
    setTeamCreated(true);
  }, [selectedUsers]);

  useEffect(() => {
    handleCreateTeam();
  }, [selectedUsers, handleCreateTeam]);

  return (
    <div className="App">
      {/* Search */}
      <div>
        <label htmlFor="search">Search by Name:</label>
        <input
          type="text"
          id="search"
          value={searchName}
          onChange={handleSearchNameChange}
        />
      </div>

      {/* Filters */}
      <div>
        <label htmlFor="filterDomain">Domain:</label>
        <select
          name="domain"
          id="filterDomain"
          value={filters.domain}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="Sales">Sales</option>
          <option value="Finance">Finance</option>
          <option value="IT">IT</option>
          <option value="Management">Management</option>
          <option value="Marketing">Marketing</option>
          {/* Add more domain options here if needed */}
        </select>
      </div>
      <div>
        <label htmlFor="filterGender">Gender:</label>
        <select
          name="gender"
          id="filterGender"
          value={filters.gender}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Others">Others</option>
          {/* Add more gender options here if needed */}
        </select>
      </div>
      <div>
        <label htmlFor="filterAvailability">Availability:</label>
        <select
          name="available"
          id="filterAvailability"
          value={filters.available}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
      </div>

      {/* User Cards */}
      <div className="user-cards">
        {users
          .slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
          )
          .map((user) => (
            <div className="user-card" key={user.id}>
              <img src={user.avatar} alt="Avatar" />
              <h3>{`${user.first_name} ${user.last_name}`}</h3>
              <p>{user.email}</p>
              <p>{user.domain}</p>
              <button
                onClick={() => handleAddToTeam(user)}
                disabled={
                  !user.available ||
                  selectedUsers.some(
                    (selectedUser) => selectedUser.id === user.id
                  ) ||
                  team.some((teamMember) => teamMember.id === user.id)
                }
              >
                Add to Team
              </button>
            </div>
          ))}
      </div>

      {/* Selected Team */}
      {teamCreated && (
        <div className="team-sidebar">
          <h2>Team</h2>
          {team.length > 0 ? (
            <ul>
              {team.map((user) => (
                <li key={user.id}>
                  {`${user.first_name} ${user.last_name} (${user.domain})`}
                  <button onClick={() => handleRemoveFromTeam(user)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members selected</p>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(users.length / ITEMS_PER_PAGE) }).map(
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default UserList;
