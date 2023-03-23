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
import {Button} from "@mui/material";

function TTK() {
    const [keywords, setKeywords] = useState([]);
    const [keysValue, setKeysValue] = useState("");

    useEffect(() => {
        function onTxt2KeyEvent(){
            window.addEventListener("txt2key", function (event) {
                console.log("got txt2key event", event);
                const newKeywords = event.detail.data.toString().split(" ").map(k => k.trim());
                setKeywords(newKeywords)
            });
        }
        const init = async () => {
            onTxt2KeyEvent();
        }
        init();
        return () => {
            window.removeEventListener("txt2key", onTxt2KeyEvent)
        }
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
            <div style={{minWidth: "50vw", maxWidth: "800px"}}>
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
                    multiline
                    rows={4}
                    defaultValue={"Lorem ipsum dolor sit amen"}
                />
                <Box mt={2}/>
                <TextField
                    id="outlined-basic"
                    label="Topics"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    defaultValue={"Lorem ipsum dolor sit amen"}
                />
                <Box mt={2}/>
                <TextField
                    id="outlined-basic"
                    label="Publisher"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    defaultValue={"Lorem ipsum dolor sit amen"}
                />
                <Box mt={2}/>
                <Button fullWidth onClick={()=>{
                    /* Broadcast the event to the host so that the UI can be updated */
                    window.dispatchEvent(
                        new CustomEvent("txt2key", { detail: {
                                type: "request",
                                data: {
                                    info: "Get the keys for a given text",
                                    text: "My text"
                                }
                            }})
                    );
                }}>Extract Keys</Button>
                <Box mt={2}/>
                <Autocomplete
                    id="combo-box-demo"
                    label="Intellikeys"
                    options={(keywords || []).map((keyword, index) => {
                        return {
                            key: index,
                           label: keyword,
                           keyword
                        }
                    })}
                    sx={{ width: 300 }}
                    disablePortal={true}
                    value={keysValue}
                    onChange={(event, value, reason, details)=>{
                        setKeysValue(value)
                    }}
                    renderInput={(params) => <TextField {...params} label="Intellikeys" />}
                />
            </div>
        </div>
    );
}

export default TTK;