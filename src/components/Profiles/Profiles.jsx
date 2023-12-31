/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import UserCard from "../UserCard/UserCard";
import styles from "./Profiles.module.css";
import { deleteUser, getdata } from "../../service/getdata";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import route from "./../../routes/routes.json";
import { PropTypes } from "prop-types";

const Profiles = ({ page = "1" }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  // const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const navigationHandler = () => {
    navigate(page === "1" ? `/${route.PROFILES}/2` : `/${route.PROFILES}/1`);
  };

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    getdata(page)
      .then((value) => {
        setUsers(value.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
        console.log("Error Loading");
      });
  }, [page]);

  const deleteUserHandler = (userIndex) => {
    deleteUser(users[userIndex].id).then((isUserDelete) => {
      if (isUserDelete) {
        const profiles = [...users];
        profiles.splice(userIndex, 1);
        setUsers(profiles);
      }
    });
  };

  const userCards = users.map((user, index) => {
    return (
      <UserCard
        key={index}
        fname={user.first_name}
        email={user.email}
        image={user.avatar}
        userIndex={index}
        deleteUserHandler={deleteUserHandler}
      />
    );
  });

  return (
    <>
      <p>Page No. {page}</p>
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          {isError && (
            <>
              <p style={{ color: "red", fontWeight: "800" }}>
                Something went wrong,Please try again later...
              </p>
            </>
          )}
          {!isError && (
            <>
              <div className={styles.profilesContainer}>{userCards}</div>
            </>
          )}
          <button onClick={navigationHandler}>
            Show Page {page === "1" ? "2" : "1"}
          </button>
        </>
      )}
    </>
  );
};

Profiles.propTypes = {
  page: PropTypes.string,
};

export default Profiles;
