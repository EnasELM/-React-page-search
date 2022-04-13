import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  makeStyles,
  Grid,
  Container,
  Card,
  Typography,
  ButtonGroup,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  FormControl: {
    minWidth: 100,
    marginBottom: 70,
  },
}));

export default function Search() {
  const classes = useStyles();
  const initialState = {
    searchText: "",
    apiUrl:
      "https://i1cqoys68c-dsn.algolia.net/1/indexes/stg_choicemarket_products/",
    apiKey: "eac7b807c0109771a245855c7501fca3",
    apiId: "I1CQOYS68C",
    amount: "",
    page: 0,
    nbPages: 0,
    arr: [],
  };

  const [searchTerm, setSearchTerm] = useState(initialState);
  function onTextChange(e) {
    setSearchTerm({ ...searchTerm, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    axios
      .get(
        `${searchTerm.apiUrl}?x-algolia-application-id=${searchTerm.apiId}&x-algolia-api-key=${searchTerm.apiKey}&query=${searchTerm.searchText}&hitsPerPage=${searchTerm.amount}&page=${searchTerm.page}`
      )
      .then((res) => {
        setSearchTerm((searchTerm) => ({
          ...searchTerm,
          arr: res.data.hits,
        }));
      })
      .catch((err) => console.log(err));
  }, [searchTerm.amount]);

  useEffect(() => {
    axios
      .get(
        `${searchTerm.apiUrl}?x-algolia-application-id=${searchTerm.apiId}&x-algolia-api-key=${searchTerm.apiKey}&query=${searchTerm.searchText}&hitsPerPage=${searchTerm.amount}&page=${searchTerm.page}`
      )
      .then((res) => {
        if (
          searchTerm.arr.length > 0 &&
          searchTerm.arr[0].Name === res.data.hits[0].Name
        ) {
        } else {
          setSearchTerm((searchTerm) => ({
            ...searchTerm,
            arr: res.data.hits,
            nbPages: res.data.nbPages,
          }));
        }
      })
      .catch((err) => console.log(err));
  }, [onTextChange]);

  function handleChange(e) {
    setSearchTerm({ ...searchTerm, [e.target.name]: e.target.value });

    e.preventDefault();
  }

  function clickToNextPage() {
    if (searchTerm.page <= searchTerm.nbPages) {
      setSearchTerm({ ...searchTerm, page: searchTerm.page + 1 });
    }
  }

  function clickToPreviousPage() {
    if (searchTerm.page > 0) {
      setSearchTerm({ ...searchTerm, page: searchTerm.page - 1 });
    }
  }

  return (
    <div>
      <TextField
        name="searchText"
        value={searchTerm.searchText}
        onChange={onTextChange}
        label="search ..."
        fullWidth={true}
      />
      <br />
      <FormControl className={classes.FormControl}>
        <InputLabel>Show</InputLabel>
        <Select name="amount" defaultValue="" onChange={handleChange}>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </FormControl>

      <div onChange={onTextChange}>
        <ButtonGroup style={{ position: "absolute", top: 160, right: 30 }}>
          <Button onClick={clickToPreviousPage}>Previous</Button>

          <Button onClick={clickToNextPage}>Next</Button>
        </ButtonGroup>
        <Container>
          <Grid container spacing={3}>
            {searchTerm.arr.map((card, i) => (
              <Grid item key={i} xs={12} md={6} lg={4}>
                <Card style={{ height: 100, padding: 10 }}>
                  <Typography variant="body1" color="initial">
                    {card.Name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ padding: 3 }}
                  >
                    {card.ingredients}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </div>
  );
}
