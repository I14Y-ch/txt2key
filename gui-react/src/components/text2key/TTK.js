import "./TTK.css"
import {useEffect, useState} from "react";
import API from "./API"
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 }
];

function TTK() {
    const [data, setData] = useState(null);
    useEffect(() => {
        const update = async () => {
            // let res = await API.queryChatGPT();
            // setData(res)
        }
        update();
    }, [])
    return (
        <div className="TTK"
             css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            `}
        >
            <div>
                <TextField
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    defaultValue={"Lorem ipsum dolor sit amen"}
                />
                <Box mt={2}/>
                <TextField
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    defaultValue={"Lorem ipsum dolor sit amen"}
                />
                <Box mt={2}/>
                <TextField
                    id="outlined-basic"
                    label="Topics"
                    variant="outlined"
                    fullWidth
                    defaultValue={"Lorem ipsum dolor sit amen"}
                />
                <Box mt={2}/>
                <TextField
                    id="outlined-basic"
                    label="Publisher"
                    variant="outlined"
                    fullWidth
                    defaultValue={"Lorem ipsum dolor sit amen"}
                />
                <Box mt={2}/>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    label="Intellikeys"
                    options={top100Films}
                    sx={{ width: 300 }}
                    open={true}
                    disablePortal={true}
                    renderInput={(params) => <TextField {...params} label="Intellikeys" />}
                />
            </div>
        </div>
    );
}

export default TTK;